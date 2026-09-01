"use client";

import { useEffect, useState, useRef } from "react";

interface SpotifyData {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  track_id?: string;
  timestamps?: {
    start: number;
    end: number;
  };
}

interface DiscordPresence {
  status: "online" | "idle" | "dnd" | "offline";
  spotify: SpotifyData | null;
  activityName?: string;
  activityDetails?: string;
  activityState?: string;
  activityImage?: string;
  activityStart?: number;
  activityEnd?: number;
  isCustomMusic?: boolean;
}

const DISCORD_USER_ID = "1402595333120458782";

function resolveDiscordAsset(appId?: string, asset?: string): string {
  if (!asset) return "";
  if (asset.startsWith("spotify:")) return `https://i.scdn.co/image/${asset.replace("spotify:", "")}`;
  if (asset.startsWith("mp:external/")) return `https://media.discordapp.net/external/${asset.replace("mp:external/", "")}`;
  if (asset.startsWith("mp:attachments/")) return `https://media.discordapp.net/attachments/${asset.replace("mp:attachments/", "")}`;
  if (appId) return `https://cdn.discordapp.com/app-assets/${appId}/${asset}.png`;
  return "";
}

function formatMs(ms: number): string {
  if (!ms || isNaN(ms) || ms < 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function formatTimeAgo(timestamp: number): string {
  if (!timestamp) return "Recently";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function sanitizeMusicBrand(text?: string): string {
  if (!text) return "";
  return text
    .replace(/ArchiveTune\s*Nightly/gi, "BTL-Music")
    .replace(/ArchiveTune/gi, "BTL-Music")
    .replace(/archivetune-nightly/gi, "BTL-Music")
    .replace(/archivetune/gi, "BTL-Music");
}

interface LastPlayedTrack {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  playedAt: number;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

async function extractAlbumColor(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      if (!imageUrl || typeof window === "undefined") return resolve(null);
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = 24;
          canvas.height = 24;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (!ctx) return resolve(null);

          ctx.drawImage(img, 0, 0, 24, 24);
          const data = ctx.getImageData(0, 0, 24, 24).data;

          let bestScore = -1;
          let bestHsl: [number, number, number] = [160, 80, 50];

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            if (a > 150) {
              const [h, s, l] = rgbToHsl(r, g, b);
              // Score colors based on saturation and ideal luminance (avoiding black/white)
              if (s > 15 && l > 15 && l < 88) {
                const lumPenalty = Math.abs(l - 55) * 1.2;
                const score = s * 2.5 - lumPenalty;
                if (score > bestScore) {
                  bestScore = score;
                  bestHsl = [h, s, l];
                }
              }
            }
          }

          if (bestScore === -1) return resolve(null);

          // Boost saturation and normalize luminance for a vivid glowing neon aesthetic
          const boostedS = Math.max(75, Math.min(100, bestHsl[1] * 1.3));
          const boostedL = Math.max(50, Math.min(65, bestHsl[2]));
          const [finalR, finalG, finalB] = hslToRgb(bestHsl[0], boostedS, boostedL);

          resolve(`rgb(${finalR}, ${finalG}, ${finalB})`);
        } catch {
          resolve(null);
        }
      };

      img.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export default function DiscordMusicWidget() {
  const [presence, setPresence] = useState<DiscordPresence | null>(null);
  const [lastPlayed, setLastPlayed] = useState<LastPlayedTrack | null>(null);
  const [dynamicGlowColor, setDynamicGlowColor] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [now, setNow] = useState(Date.now());
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize last played track from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("btl_last_played_track");
      if (saved) {
        setLastPlayed(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // 1-second live ticker for real-time progress bar & timers
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let heartbeatTimer: NodeJS.Timeout | null = null;

    const handleLanyardData = (data: any) => {
      if (!isMounted || !data) return;

      const isSpotify = Boolean(data.listening_to_spotify && data.spotify);
      const activities = data.activities || [];
      
      const musicActivity = activities.find(
        (a: any) => (a.type === 2 || (a.timestamps?.end && a.assets?.large_image)) && a.name !== "Custom Status"
      );

      const otherActivity = activities.find(
        (a: any) => a.type !== 4 && a.name !== "Custom Status" && a.name !== "Spotify"
      );

      const activeCustomMusic = !isSpotify && Boolean(musicActivity);
      const chosenActivity = musicActivity || otherActivity;

      const activityImage = resolveDiscordAsset(
        chosenActivity?.application_id,
        chosenActivity?.assets?.large_image
      );

      const rawActivityName = chosenActivity?.name;
      const cleanActivityName = sanitizeMusicBrand(rawActivityName);
      const cleanActivityDetails = sanitizeMusicBrand(chosenActivity?.details);
      const cleanActivityState = sanitizeMusicBrand(chosenActivity?.state);

      // Persist active music to localStorage for offline recall
      if (isSpotify && data.spotify) {
        const trackObj: LastPlayedTrack = {
          song: data.spotify.song,
          artist: data.spotify.artist,
          album: data.spotify.album,
          album_art_url: data.spotify.album_art_url,
          playedAt: Date.now(),
        };
        try {
          localStorage.setItem("btl_last_played_track", JSON.stringify(trackObj));
          setLastPlayed(trackObj);
        } catch {}
      } else if (activeCustomMusic && musicActivity) {
        const trackObj: LastPlayedTrack = {
          song: sanitizeMusicBrand(musicActivity.details || musicActivity.name),
          artist: sanitizeMusicBrand(musicActivity.state || "balajitechlabs"),
          album: sanitizeMusicBrand(musicActivity.name) || "BTL-Music",
          album_art_url: activityImage || "/assets/img/btl-topographic-avatar.png",
          playedAt: Date.now(),
        };
        try {
          localStorage.setItem("btl_last_played_track", JSON.stringify(trackObj));
          setLastPlayed(trackObj);
        } catch {}
      }

      setPresence({
        status: data.discord_status || "offline",
        spotify: isSpotify
          ? {
              song: data.spotify.song,
              artist: data.spotify.artist,
              album: data.spotify.album,
              album_art_url: data.spotify.album_art_url,
              track_id: data.spotify.track_id,
              timestamps: data.spotify.timestamps,
            }
          : null,
        activityName: cleanActivityName,
        activityDetails: cleanActivityDetails,
        activityState: cleanActivityState,
        activityImage: activityImage || undefined,
        activityStart: chosenActivity?.timestamps?.start,
        activityEnd: chosenActivity?.timestamps?.end,
        isCustomMusic: activeCustomMusic,
      });
      setLoaded(true);
    };

    const fetchRest = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
        const json = await res.json();
        if (json?.success && json?.data) {
          handleLanyardData(json.data);
        }
      } catch (err) {
        console.warn("Lanyard REST fallback error:", err);
      }
    };

    const connectWs = () => {
      try {
        const ws = new WebSocket("wss://api.lanyard.rest/socket");
        wsRef.current = ws;

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            const { op, d, t } = msg;

            if (op === 1) {
              const interval = d.heartbeat_interval;
              heartbeatTimer = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                  ws.send(JSON.stringify({ op: 3 }));
                }
              }, interval);

              ws.send(
                JSON.stringify({
                  op: 2,
                  d: { subscribe_to_id: DISCORD_USER_ID },
                })
              );
            }

            if (op === 0) {
              if (t === "INIT_STATE" || t === "PRESENCE_UPDATE") {
                handleLanyardData(d);
              }
            }
          } catch (e) {
            console.warn("Lanyard WS parse error:", e);
          }
        };

        ws.onerror = () => {
          fetchRest();
        };

        ws.onclose = () => {
          if (heartbeatTimer) clearInterval(heartbeatTimer);
        };
      } catch {
        fetchRest();
      }
    };

    fetchRest();
    connectWs();

    const pollInterval = setInterval(fetchRest, 15000);

    return () => {
      isMounted = false;
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      clearInterval(pollInterval);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const spotify = presence?.spotify;
  const isCustomMusic = presence?.isCustomMusic;
  const isPlayingMusic = Boolean(spotify || isCustomMusic);
  const status = presence?.status || "offline";

  // Calculate live progress and duration
  let progressPercent = 0;
  let currentElapsedStr = "0:00";
  let totalDurationStr = "0:00";

  if (spotify?.timestamps) {
    const { start, end } = spotify.timestamps;
    const totalDuration = end - start;
    const currentElapsed = Math.max(0, now - start);
    progressPercent = Math.min(100, Math.max(0, (currentElapsed / totalDuration) * 100));
    currentElapsedStr = formatMs(currentElapsed);
    totalDurationStr = formatMs(totalDuration);
  } else if (presence?.activityStart && presence?.activityEnd) {
    const totalDuration = presence.activityEnd - presence.activityStart;
    const currentElapsed = Math.max(0, now - presence.activityStart);
    progressPercent = Math.min(100, Math.max(0, (currentElapsed / totalDuration) * 100));
    currentElapsedStr = formatMs(currentElapsed);
    totalDurationStr = formatMs(totalDuration);
  } else if (presence?.activityStart) {
    const elapsed = Math.max(0, now - presence.activityStart);
    currentElapsedStr = formatMs(elapsed);
  }

  const destinationHref = "https://github.com/balajitechlabs/discord-music-card";

  const hasLastPlayed = !isPlayingMusic && !presence?.activityName && Boolean(lastPlayed);
  const coverImageUrl =
    spotify?.album_art_url ||
    presence?.activityImage ||
    (hasLastPlayed && lastPlayed
      ? lastPlayed.album_art_url
      : "/assets/img/btl-topographic-avatar.png");
  const songTitle = sanitizeMusicBrand(
    spotify?.song ||
      presence?.activityDetails ||
      presence?.activityName ||
      "Music Player"
  );
  const songArtist = sanitizeMusicBrand(
    spotify?.artist ||
      presence?.activityState ||
      presence?.activityName ||
      "balajitechlabs"
  );
  const albumOrSub = sanitizeMusicBrand(
    spotify?.album ||
      (isCustomMusic ? presence?.activityName || "BTL-Music" : "balajitechlabs")
  );

  // ── Dynamically extract vibrant accent color from album artwork ──
  useEffect(() => {
    let isCurrent = true;
    if (coverImageUrl && !coverImageUrl.includes("btl-topographic-avatar.png")) {
      extractAlbumColor(coverImageUrl).then((color) => {
        if (isCurrent && color) {
          setDynamicGlowColor(color);
        }
      });
    } else {
      setDynamicGlowColor(null);
    }
    return () => {
      isCurrent = false;
    };
  }, [coverImageUrl]);

  const activeAccent = dynamicGlowColor || "var(--primary-color)";

  return (
    <a
      href={destinationHref}
      target="_blank"
      id="music"
      rel="noreferrer"
      data-title={
        isPlayingMusic
          ? `Playing: ${songTitle} by ${songArtist}`
          : hasLastPlayed
          ? `Last Played: ${lastPlayed?.song} by ${lastPlayed?.artist}`
          : "balajitechlabs · Live Discord Music Card"
      }
      className="item"
    >
      <div
        id="last"
        className={`show discord-presence-badge status-${status} ${isPlayingMusic ? "music-active" : ""}`}
        style={
          {
            "--dynamic-music-color": activeAccent,
            boxShadow:
              isPlayingMusic || hasLastPlayed
                ? dynamicGlowColor
                  ? `0 16px 45px color-mix(in srgb, ${dynamicGlowColor} 40%, rgba(0, 0, 0, 0.45)), 0 0 28px color-mix(in srgb, ${dynamicGlowColor} 30%, transparent), 0 0 60px color-mix(in srgb, ${dynamicGlowColor} 18%, transparent)`
                  : undefined
                : undefined,
            borderColor:
              isPlayingMusic || hasLastPlayed
                ? dynamicGlowColor
                  ? `color-mix(in srgb, ${dynamicGlowColor} 60%, rgba(255, 255, 255, 0.15))`
                  : undefined
                : undefined,
          } as React.CSSProperties
        }
      >
        <div className="music-ambient-beam" aria-hidden="true" />
        <div id="music-holder">
          {isPlayingMusic ? (
            <div className="discord-artwork-container">
              <img
                id="artwork"
                src={coverImageUrl}
                alt={albumOrSub || "Music artwork"}
                className="loaded music-album-art"
              />
              <span className="music-playing-badge">
                <span className="material-symbols-rounded">graphic_eq</span>
              </span>
            </div>
          ) : hasLastPlayed && lastPlayed ? (
            <div className="discord-artwork-container">
              <img
                id="artwork"
                src={lastPlayed.album_art_url}
                alt={lastPlayed.album || "Last played artwork"}
                className="loaded music-album-art offline-dim"
              />
              <span className={`discord-status-indicator indicator-${status}`} />
            </div>
          ) : (
            <div className="discord-status-avatar-wrapper">
              <img
                id="artwork"
                src="/assets/img/btl-topographic-avatar.png"
                alt="balajitechlabs"
                className="loaded discord-avatar-img"
              />
              <span className={`discord-status-indicator indicator-${status}`} />
            </div>
          )}

          <div id="track" className={loaded ? "loaded" : "loading"}>
            {isPlayingMusic ? (
              <div className="music-details-pane">
                <div className="music-header-row">
                  <span className="music-now-playing-label">
                    {spotify ? "LISTENING ON SPOTIFY" : isCustomMusic ? "PLAYING ON BTL-MUSIC" : "PLAYING ON DISCORD"}
                  </span>
                </div>
                <p className="music-title">
                  <strong>{songTitle}</strong>
                </p>
                <p className="music-artist">{songArtist}</p>
                <p className="track-album-sub">{albumOrSub}</p>

                {/* Real-time Interactive Progress Bar */}
                <div className="music-progress-wrapper">
                  <div className="music-progress-bar-track">
                    <div
                      className="music-progress-bar-fill"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="music-timestamps-row">
                    <span>{currentElapsedStr}</span>
                    <span>{totalDurationStr !== "0:00" ? totalDurationStr : "LIVE"}</span>
                  </div>
                </div>
              </div>
            ) : presence?.activityName ? (
              <div className="music-details-pane">
                <div className="music-header-row">
                  <span className="music-now-playing-label">DISCORD ACTIVITY</span>
                </div>
                <p className="music-title">
                  <strong>{presence.activityName}</strong>
                </p>
                <p className="music-artist">{presence.activityDetails || presence.activityState || "Active"}</p>
                <p className="track-album-sub">
                  {presence.activityStart ? `Elapsed: ${currentElapsedStr}` : "balajitechlabs"}
                </p>
              </div>
            ) : hasLastPlayed && lastPlayed ? (
              <div className="music-details-pane">
                <div className="music-header-row">
                  <span className="music-now-playing-label">
                    LAST PLAYED ON BTL-MUSIC · {formatTimeAgo(lastPlayed.playedAt)}
                  </span>
                </div>
                <p className="music-title">
                  <strong>{sanitizeMusicBrand(lastPlayed.song)}</strong>
                </p>
                <p className="music-artist">{sanitizeMusicBrand(lastPlayed.artist)}</p>
                <p className="track-album-sub">
                  {status === "online"
                    ? "🟢 Online on Discord"
                    : status === "idle"
                    ? "🟡 Away from Keyboard"
                    : status === "dnd"
                    ? "🔴 Do Not Disturb"
                    : "⚪ Offline · Tap to view track on GitHub"}
                </p>
              </div>
            ) : (
              <div className="music-details-pane">
                <div className="music-header-row">
                  <span className="music-now-playing-label">DISCORD PRESENCE · BENGALURU 🇮🇳</span>
                </div>
                <p className="music-title">
                  <strong>Balaji S.</strong>
                </p>
                <p className="music-artist">
                  {status === "online"
                    ? "🟢 Online & Building QuickDash"
                    : status === "idle"
                    ? "🟡 Away from Keyboard"
                    : status === "dnd"
                    ? "🔴 Do Not Disturb"
                    : "⚪ Offline · Principal Android Architect"}
                </p>
                <p className="track-album-sub">||BTL||™ · balajitechlabs</p>
              </div>
            )}
          </div>

          <div id="playback-bars" className={isPlayingMusic ? "loaded playing" : "loading"}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      </div>
    </a>
  );
}
