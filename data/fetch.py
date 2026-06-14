#!/usr/bin/env python3
"""
WorldRank — Data Fetcher
Obtiene datos reales de Google Trends, Reddit y YouTube RSS.
Genera data/data.json que el frontend consume sin depender de CORS proxies.
"""

import json
import os
import re
import time
import urllib.request
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_FILE = os.path.join(DATA_DIR, "data.json")
TIMEOUT = 15  # segundos por request


def fetch_url(url, retries=2):
    """Fetch a URL with retries and timeout."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": (
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/120.0.0.0 Safari/537.36"
                    ),
                    "Accept": "application/json, text/plain, */*",
                },
            )
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(1)
            else:
                print(f"  ⚠️  Error fetching {url}: {e}")
                return None


def fetch_google_trends():
    """Fetch Google Trends daily RSS feed."""
    print("  📡 Google Trends...")
    rss_url = "https://trends.google.com/trends/trendingsearches/daily/rss?geo=US"
    xml_data = fetch_url(rss_url)
    if not xml_data:
        return []

    results = []
    try:
        root = ET.fromstring(xml_data)
    except ET.ParseError:
        return []

    # RSS namespace
    ns = {"": "http://purl.org/rss/1.0/", "ht": "http://www.w3.org/2005/Atom"}

    # Try without namespace first
    items = root.findall(".//item")
    if not items:
        items = root.findall(".//{}item".format(ns.get("") or ""))

    for item in items:
        title_el = item.find("title")
        traffic_el = item.find("ht:approx_traffic", ns) if ns.get("ht") else None
        title = title_el.text if title_el is not None else "Tendencia"
        traffic = traffic_el.text if traffic_el is not None else None

        if traffic:
            # Parse "100,000+" -> "100K+ búsquedas"
            num_str = re.sub(r"[^\d]", "", traffic)
            try:
                num = int(num_str)
                if num >= 1_000_000:
                    traffic_str = f"🔍 {num // 1_000_000}M+ búsquedas"
                elif num >= 1_000:
                    traffic_str = f"🔍 {num // 1_000}K+ búsquedas"
                else:
                    traffic_str = f"🔍 {num} búsquedas"
            except ValueError:
                traffic_str = "🔍 Google Trends Global"
        else:
            traffic_str = "🔍 Google Trends Global"

        results.append({
            "position": len(results) + 1,
            "title": title.strip()[:80] if title else "Tendencia",
            "meta": traffic_str,
            "trend": "🔥",
        })
        if len(results) >= 10:
            break

    return results


def fetch_youtube():
    """Fetch YouTube trending via RSS."""
    print("  📡 YouTube Trending...")
    rss_url = "https://www.youtube.com/feeds/videos.xml?chart=most_popular&hl=es&gl=US"
    xml_data = fetch_url(rss_url)
    if not xml_data:
        return []

    results = []
    try:
        root = ET.fromstring(xml_data)
    except ET.ParseError:
        return []

    ns = {
        "atom": "http://www.w3.org/2005/Atom",
        "media": "http://search.yahoo.com/mrss/",
    }

    entries = root.findall("atom:entry", ns)
    if not entries:
        entries = root.findall("entry")

    for entry in entries:
        title_el = entry.find("atom:title", ns) or entry.find("title")
        author_el = entry.find("atom:author", ns) or entry.find("author")
        name_el = author_el.find("atom:name", ns) or author_el.find("name") if author_el is not None else None

        title = title_el.text if title_el is not None else "Sin título"
        author = name_el.text if name_el is not None else "YouTube"

        results.append({
            "position": len(results) + 1,
            "title": title.strip()[:80] if title else "Sin título",
            "meta": f"📺 {author} · YouTube Trending",
            "trend": "▶️",
        })
        if len(results) >= 10:
            break

    return results


def fetch_reddit():
    """Fetch Reddit r/all hot posts via JSON API."""
    print("  📡 Reddit...")
    url = "https://www.reddit.com/r/all/hot.json?limit=10"
    json_data = fetch_url(url)
    if not json_data:
        return []

    results = []
    try:
        parsed = json.loads(json_data)
        children = parsed.get("data", {}).get("children", [])
    except (json.JSONDecodeError, KeyError, TypeError):
        return []

    for i, child in enumerate(children):
        data = child.get("data", {})
        title = data.get("title", "Post de Reddit")
        score = data.get("score", 0)
        subreddit = data.get("subreddit", "all")

        if score > 1000:
            score_str = f"{score / 1000:.1f}K votos"
        else:
            score_str = f"{score} votos"

        results.append({
            "position": i + 1,
            "title": title.strip()[:80],
            "meta": f"r/{subreddit} · {score_str}",
            "trend": "🔺",
        })

    return results


def fetch_twitter_trends():
    """Mock data for Twitter/X trends (no free API available)."""
    print("  📡 X/Twitter (datos de muestra realistas)...")
    # Estos se actualizan manualmente cada cierto tiempo
    return [
        {"position": 1, "title": "#WorldCup2026", "meta": "⚽ Deporte · 2.1M tweets", "trend": "🚀"},
        {"position": 2, "title": "#AI", "meta": "🤖 Tecnología · 1.8M tweets", "trend": "🚀"},
        {"position": 3, "title": "#Bitcoin", "meta": "💰 Finanzas · 1.5M tweets", "trend": "🚀"},
        {"position": 4, "title": "#Eurovision", "meta": "🎵 Música · 980K tweets", "trend": "📈"},
        {"position": 5, "title": "#NASA", "meta": "🚀 Ciencia · 850K tweets", "trend": "📈"},
        {"position": 6, "title": "#Netflix", "meta": "🎬 Entretenimiento · 720K tweets", "trend": "📈"},
        {"position": 7, "title": "#ElonMusk", "meta": "💼 Personas · 680K tweets", "trend": "📈"},
        {"position": 8, "title": "#ChatGPT", "meta": "🤖 Tecnología · 610K tweets", "trend": "📈"},
        {"position": 9, "title": "#Olympics", "meta": "🏅 Deporte · 590K tweets", "trend": "📈"},
        {"position": 10, "title": "#Gaming", "meta": "🎮 Gaming · 520K tweets", "trend": "📈"},
    ]


def build_hero_stats(data):
    """Calculate hero stats from fetched data."""
    total = 0
    for key in ["trends", "youtube", "reddit", "twitter"]:
        total += len(data.get(key, []))
    return {
        "total_topics": f"{total}+",
        "sources": 4,
        "coverage": "🌐",
    }


def main():
    print("🌍 WorldRank — Data Fetcher")
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    # Fetch all sources
    results = {
        "timestamp": datetime.now().isoformat(),
        "trends": fetch_google_trends(),
        "youtube": fetch_youtube(),
        "reddit": fetch_reddit(),
        "twitter": fetch_twitter_trends(),
    }

    # Build stats
    results["stats"] = build_hero_stats(results)

    # Report
    print()
    for key, label in [("trends", "Google Trends"), ("youtube", "YouTube"), ("reddit", "Reddit"), ("twitter", "X/Twitter")]:
        items = results.get(key, [])
        status = f"✅ {len(items)} items" if items else "⚠️  Sin datos (fallback usado)"
        print(f"  {label}: {status}")

    # Fallback: if all proxies fail, generate sample data
    if not results["trends"] and not results["youtube"] and not results["reddit"]:
        print("\n  ⚠️  No se pudieron obtener datos de ninguna fuente.")
        print("  Usando datos de muestra como respaldo...")
        results["trends"] = [
            {"position": 1, "title": "US Open 2026", "meta": "🔍 2M+ búsquedas", "trend": "🔥"},
            {"position": 2, "title": "World Cup Qualifiers", "meta": "🔍 1.5M+ búsquedas", "trend": "🔥"},
            {"position": 3, "title": "iPhone 18 Pro", "meta": "🔍 1.2M+ búsquedas", "trend": "🔥"},
            {"position": 4, "title": "Hurricane Season", "meta": "🔍 980K+ búsquedas", "trend": "📈"},
            {"position": 5, "title": "Bitcoin Price Today", "meta": "🔍 850K+ búsquedas", "trend": "📈"},
            {"position": 6, "title": "AI News", "meta": "🔍 720K+ búsquedas", "trend": "📈"},
            {"position": 7, "title": "Tesla Robotaxi", "meta": "🔍 680K+ búsquedas", "trend": "📈"},
            {"position": 8, "title": "Summer Olympics 2028", "meta": "🔍 610K+ búsquedas", "trend": "📈"},
            {"position": 9, "title": "NVIDIA Stock", "meta": "🔍 590K+ búsquedas", "trend": "📈"},
            {"position": 10, "title": "SpaceX Mars Mission", "meta": "🔍 520K+ búsquedas", "trend": "📈"},
        ]
        results["youtube"] = [
            {"position": 1, "title": "World Cup 2026 Highlights", "meta": "📺 ESPN · YouTube Trending", "trend": "▶️"},
            {"position": 2, "title": "MrBeast — $1 vs $1,000,000,000", "meta": "📺 MrBeast · YouTube Trending", "trend": "▶️"},
            {"position": 3, "title": "New iPhone 18 Pro Review", "meta": "📺 MKBHD · YouTube Trending", "trend": "▶️"},
            {"position": 4, "title": "AI Creates Realistic Human", "meta": "📺 TechWorld · YouTube Trending", "trend": "▶️"},
            {"position": 5, "title": "Incredible Football Goals 2026", "meta": "📺 SportsCenter · YouTube Trending", "trend": "▶️"},
            {"position": 6, "title": "How Quantum Computers Work", "meta": "📺 Veritasium · YouTube Trending", "trend": "▶️"},
            {"position": 7, "title": "Top 10 Movies This Month", "meta": "📺 IMDb · YouTube Trending", "trend": "▶️"},
            {"position": 8, "title": "Extreme Weather Compilation", "meta": "📺 BBC News · YouTube Trending", "trend": "▶️"},
            {"position": 9, "title": "New Song — Global Hit", "meta": "📺 Vevo · YouTube Trending", "trend": "▶️"},
            {"position": 10, "title": "Prison Break Season 6 Trailer", "meta": "📺 Netflix · YouTube Trending", "trend": "▶️"},
        ]
        results["reddit"] = [
            {"position": 1, "title": "What's a conspiracy theory you 100% believe in?", "meta": "r/AskReddit · 52K votos", "trend": "🔺"},
            {"position": 2, "title": "This photo from the World Cup is incredible", "meta": "r/pics · 45K votos", "trend": "🔺"},
            {"position": 3, "title": "ELI5: How does AI actually learn?", "meta": "r/explainlikeimfive · 38K votos", "trend": "🔺"},
            {"position": 4, "title": "TIL that octopuses have three hearts", "meta": "r/todayilearned · 31K votos", "trend": "🔺"},
            {"position": 5, "title": "A cool guide to surviving heat waves", "meta": "r/coolguides · 28K votos", "trend": "🔺"},
            {"position": 6, "title": "Meirl: Monday morning coffee", "meta": "r/meirl · 25K votos", "trend": "🔺"},
            {"position": 7, "title": "Programmer humor: JavaScript vs TypeScript", "meta": "r/ProgrammerHumor · 22K votos", "trend": "🔺"},
            {"position": 8, "title": "Damn, that's interesting: Ancient cities", "meta": "r/Damnthatsinteresting · 20K votos", "trend": "🔺"},
            {"position": 9, "title": "Wholesome: Grandparent learns gaming", "meta": "r/MadeMeSmile · 18K votos", "trend": "🔺"},
            {"position": 10, "title": "Gaming: Best indie games of 2026", "meta": "r/gaming · 15K votos", "trend": "🔺"},
        ]
        results["stats"] = {
            "total_topics": "40+",
            "sources": 4,
            "coverage": "🌐",
        }

    # Write output
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Datos guardados en {OUTPUT_FILE}")
    print(f"📊 Total: {results['stats']['total_topics']} temas de {results['stats']['sources']} fuentes")


if __name__ == "__main__":
    main()
