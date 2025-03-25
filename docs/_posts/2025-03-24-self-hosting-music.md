---
layout: post
title: "Self Hosting Music"
date: 2025-03-24 12:00:00 +0000
author: Jack Jazrawy-Brown
---
Music streaming services are excellent in a lot of ways. I'm a Spotify user, and the ability to listen to just about any piece of music recorded in the last hundred years, wherever and whenever I want, is pretty amazing. I've found some of my favourite artists via playlists and recommendations, and there are without doubt musicians who I never would have stumbled across without the guidance of an algorithm.

There are, however, plenty of aspects of streaming that are... less great. From the artist's perspective, streamers pay out a paltry - and shrinking - sum per stream, something that has made surviving as an indie artist increasingly impossible in the modern music landscape. The injection of piles of VC funding into the music industry has allowed music's value to diminish year on year - we as listeners consume more than ever, for lower cost than ever, in a way that feels deeply unsustainable. Further, content can be, and often is, removed unilaterally, and all aspects of the user's experience can be altered without notice - for example, Spotify's app going from great UX to trying to sell me fitness courses. Users, as is common with so many modern SaaS offerings, have no freedom and no control.

So what can we do about it? Well, it's 2025:

- Computers are cheap
- Fast, solid state storage is cheap
- High quality digital audio from Bandcamp and CDs is cheap
- Polished, free and open source music server software exists
- All of the app developers who Spotify didn't bother to hire are making much better streaming frontends on their own, and you are free to use them to your heart's content

With a bit of tinkering, you can self-host a streaming experience that matches and even surpasses a typical SaaS, can be infinitely customized, and will not try to make you listen to true crime podcasts. To work!

## Digital Audio

First step: get some music. For setting up a streaming box, high quality digital audio files are best - WAV or FLAC (losslessly compressed) are the maximum. 44.1kHz/16-bit is considered CD quality - these files are fairly large, but storage is affordable these days, and in my view retaining maximum quality is the best way to future proof your collection.

I would recommend two sources for high quality digital audio: Bandcamp and CDs. The former is the easiest, and in many cases cheapest way to obtain music - most indie bands will post albums there, and the 85% artist cut leaves musicians with a far greater sum per download than streamers. For older stuff that might not be on Bandcamp, CDs are excellent - they are presently at the lowest ebb of their value (think vinyl records circa 2000) and can be found on eBay, wob.com and others for pocket change. Extracting audio from a CD requires ripping - to do this, you can use an old laptop with a CD drive, or an external drive - [this one](https://www.amazon.co.uk/Rioddas-External-Portable-Rewriter-Desktop/dp/B07JGWBLVH) from Amazon costs £20 and works very well. Software wise, I've had great results with [Exact Audio Copy](https://www.exactaudiocopy.de/) - but there are a variety of options.

I think it's important to point out that this is unlikely to be cheaper than subscribing to a streaming service for most people. I would say, though, that that is perhaps not a bad thing. By paying an artist directly you are injecting far more funding into music than the tiny fraction of your streaming subscription that makes it into artist's pockets. Anecdotally, I listen to and enjoy an album more thoroughly when I've paid for it directly - it becomes a part of the collection, rather than an impermanent piece of content to be consumed and discarded.

## Tags

So you've got a pile of music files. Wouldn't it be nice if the artwork, track titles, artists and other information was embedded in the file itself? Easy - [Picard](https://picard.musicbrainz.org/) by MusicBrainz can largely automate tagging, renaming and sorting files. Picard is hugely powerful (I've successfully used it to batch process over 600 albums with very minimal input from me) and can make standardising and organising a music library incredibly easy. Tagging can be done by EAC and other ripping software, but having separating obtaining music files and tagging them is quite useful when using Bandcamp in addition to CDs. My workflow generally looks like this:

- Use "Open Folder" to load up whatever I've just ripped or downloaded from Bandcamp
- Use "Cluster" to group by folder if multiple items are being processed (I tend to manually organise artists and albums into folders before tagging)
- Ensure "Rename Files" is checked under "Options" in the top bar (and "Move Files" if you want, but this can be a bit slower in my experience)
- Use either "Scan", "Lookup", or "Lookup CD" to search the MusicBrainz database for the tracks. Most of the time it's perfect first try, in which case you can select the album on the right and hit save. If not, you can drag and drop files around to match them up with their tracks, and you can also right click to change the release if multiple versions exist and it's picked the wrong one. If it really messes up, it may be worth reloading the album and trying a different option, or manually selecting the release on MusicBrainz. There's a bit of an art to this in some cases, but usually Picard won't need too much help to correctly tag songs.
The files will now be named with a standard format and have all relevant metadata embedded, which is going to make the next step a lot more fun!

Picard also exposes a scripting language which allows you to customise how it names files. There are a few presets, but I use a custom script which names files to `Disc X - XX - Title.wav` (and arranges them by artists and album if "Move Files" is on):

```
$if2(%albumartist%,%artist%)/
$if(%albumartist%,%album%/,)
$if($gt(%totaldiscs%,1),Disc %discnumber% - ,)
$if($and(%albumartist%,%tracknumber%),$num(%tracknumber%,2) - ,)
%title%
```

## Server Up

You could stop now, fire up VLC and have a great time listening to all your music files - but Spotify would definitely still win with the "listen anywhere" angle. This is easily fixed with a cheap home server. I've got an old Lenovo ThinkCentre I picked up on eBay for £80, but that's honestly overkill for just music. An old laptop or a Raspberry Pi would do fine. You do need sufficient storage for your music, so factor that into whatever system you get your hands on.

Server hardware need server software, and my choice is [Jellyfin](https://jellyfin.org/) - it's free and open source and works brilliantly. It's also incredibly easy to use - just point it at your music using the setup guide and it'll pretty much sort itself out. My server is running a headless Debian install, with Jellyfin deployed via Docker. The steps for setting this up were pretty simple, assuming familiarity with a Linux shell:

- Install Debian, add your public key for SSH and disable password auth
- Install [Docker Engine](https://docs.docker.com/engine/install/debian/)
- Set up a Compose file as shown [here](https://jellyfin.org/docs/general/installation/container/#using-docker-compose) - if you're just streaming music, you can trim the `volumes` section to `config`, `cache` and one `media` volume, as the rest is unnecessary
- Spin things up with `docker compose up -d`
- Use `rysnc` or similar to copy over your ripped music
- Go to your server's IP and set up an account via the web interface. Password strength is not a huge worry, as we won't be exposing this to the public internet.

This article is aimed at a more tech-experienced user, but it's worth noting there's no reason you can't do this with a GUI installer in Windows if you want to - see how [here](https://jellyfin.org/docs/general/installation/windows#install-using-installer).

After a few minutes, album artwork and song details are all present in the web UI. Deeply cool.

![jellyfin](/assets/img/posts/self-hosted-music/jellyfin.webp)

## VPN Magic

A default Jellyfin install gets us pretty close to our own streaming service - and in fact on a local network, we're there. But we want to listen *anywhere*. Thankfully, [Tailscale](https://tailscale.com/) uses VPNs and DNS magic to expose a private tunnel to your server. Just install Tailscale on the server and on any client device, and you should be able to access the server from any network in the world via a domain like `shire.my-tailnet.ts.net` - read the docs for details.

I don't completely love that a cloud service is a necessary component of this setup, but realistically I'd much rather route my traffic through an encrypted tunnel than port forward 8080 for all the world to see. If Tailscale does shut down (or becomes evil or something) there are alternatives, like self hosting Headscale or Nebula.

If you want TLS for your Tailscale domain, the simplest way is Caddy. Caddy is awesome - for public facing domains, two lines of config will get you a TLS certificate completely automatically. Installation instructions are [here](https://caddyserver.com/docs/install) - the simplest way if you don't need the latest version is the `apt` package, which auto-configures a system service for you. Once Caddy is installed, everything is configured in `/etc/caddy/Caddyfile`. To simply reverse proxy all traffic to Jellyfin, you would add the following:

```
shire.my-tailnet.ts.net

reverse_proxy :8096
```

As Tailscale does not edit the public DNS record, a bit of additional config may be needed as detailed [here](https://tailscale.com/blog/caddy) - things are supposed to work automatically, but I needed to do [these steps](https://tailscale.com/kb/1190/caddy-certificates#provide-non-root-users-with-access-to-fetch-certificate) to get things up and running for Caddy as a non-root user. You may also have some fun DNS issues. I managed to fix mine by installing `systemd-resolved`, but Linux DNS config is [rather complicated](https://tailscale.com/kb/1188/linux-dns) and your mileage may vary.

This part still feels like magic, and is kind of the killer tech that makes this setup viable. Much as I love a physical music collection, streaming to my phone is just the most convenient way of listening to music, and being able to listen to my own music wherever I want is pretty incredible.

## Clients

This stuff is just icing on the cake really, but Jellyfin (being open source) has an awesome ecosystem of third party clients that can be used to stream your music. On desktop, [Feishin](https://github.com/jeffvli/feishin) is my choice. The Spotify desktop app has been progressively regressing for years, and now looks like a poorly designed mobile app that has been stretched on the rack. It upsets me, and I have not used it once since I set up my server. On Android, I use [Symfonium](https://symfonium.app/), which is quite probably the best app (let alone music player) I have ever used. It's beautiful, fast, lets me download tracks for playback offline and beats Spotify in every conceivable way. There are also fun clients like [jellycli](https://github.com/tryffel/jellycli), which lets you listen to music in your terminal and also offers remote control capabilities.

![feishin](/assets/img/posts/self-hosted-music/feishin.webp)
*Feishin, looking fantastic*

It's not a great time to be a streaming user. Fees are increasing, advertising is creeping into paid services and quality of service is stagnant or going backwards. The more compressed streaming services can make content without the average user noticing, the lower their bandwidth and storage costs will be. I'm not an overly fussy listener, but there's a flatness to Spotify that starts to tire out my ears after a couple of hours of listening, something which I really don't miss with my self hosted collection.

I've collected records for years and have always had music files kicking around, but Jellyfin, Picard and Tailscale were the key bits of tech that make this setup viable, and have allowed it to actual displace Spotify for a decent chunk of my listening. I still love the ability to discover new artists and genres that streamers offer, something that's tough to beat with a self hosted library - but for listening to my favourite albums, I'm never going back.
