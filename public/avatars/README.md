# Athlete profile photos

The app shows a portrait for every athlete. Resolution order per person:

1. A **real photo** you drop here (`<name-slug>.jpg` / `.png` / `.webp`)
2. The generated illustrated SVG (`<name-slug>.svg`, already committed)
3. A tinted initials chip (only if both are missing)

## To use real (photo) faces

1. Add image files named by the **exact slug** below (square images look best; they're center-cropped into a circle).
2. Regenerate the manifest so the app knows they exist:
   ```
   node scripts/gen-avatar-manifest.mjs
   ```
3. Rebuild / restart dev. Done.

> ⚠️ Recommendation: use **AI‑generated synthetic faces** or **properly‑licensed** images.
> This dashboard labels people with fraud/injury flags, and most stock licenses
> forbid portraying an identifiable real person "in a bad light."

## Filenames (M = male, F = female)

| Athlete | File |
|---|---|
| Deepika Kumari Munda (F) | `deepika-kumari-munda.jpg` |
| Arjun Mahato (M) | `arjun-mahato.jpg` |
| Salima Tete Kispotta (F) | `salima-tete-kispotta.jpg` |
| Rohit Oraon (M) | `rohit-oraon.jpg` |
| Priya Soren (F) | `priya-soren.jpg` |
| Vikram Singh Munda (M) | `vikram-singh-munda.jpg` |
| Sunita Kumari (F) | `sunita-kumari.jpg` |
| Manish Gope (M) | `manish-gope.jpg` |
| Anjali Ekka (F) | `anjali-ekka.jpg` |
| Suresh Yadav Jr. (M) | `suresh-yadav-jr.jpg` |
| Mary Hansda (F) | `mary-hansda.jpg` |
| Rakesh Tirkey Jr. (M) | `rakesh-tirkey-jr.jpg` |
| Pooja Kumari (F) | `pooja-kumari.jpg` |
| Imran Ansari (M) | `imran-ansari.jpg` |
| Lalita Hembrom (F) | `lalita-hembrom.jpg` |
| Naveen Mahto (M) | `naveen-mahto.jpg` |
| Sushila Purty (F) | `sushila-purty.jpg` |
| Albert Lakra Jr. (M) | `albert-lakra-jr.jpg` |
| Reena Tudu (F) | `reena-tudu.jpg` |
| Balwant Singh Jr. (M) | `balwant-singh-jr.jpg` |
| Phulmani Hansda (F) | `phulmani-hansda.jpg` |
| Chandan Pandey (M) | `chandan-pandey.jpg` |
| Sabina Murmu (F) | `sabina-murmu.jpg` |
| Gautam Bose Jr. (M) | `gautam-bose-jr.jpg` |
| Nirmala Kachhap (F) | `nirmala-kachhap.jpg` |
| Devendra Oraon Jr. (M) | `devendra-oraon-jr.jpg` |
| Sylvanus Dungdung Jr. (M) | `sylvanus-dungdung-jr.jpg` |
| Anita Kumari (F) | `anita-kumari.jpg` |
| Mahavir Oraon Jr. (M) | `mahavir-oraon-jr.jpg` |
| Sushma Singh Jr. (F) | `sushma-singh-jr.jpg` |
| Joseph Toppo Jr. (M) | `joseph-toppo-jr.jpg` |
| Etwari Devi Jr. (F) | `etwari-devi-jr.jpg` |
| Harish Gope (M) | `harish-gope.jpg` |
| Iqbal Hussain Jr. (M) | `iqbal-hussain-jr.jpg` |
| Birsa Purty (M) | `birsa-purty.jpg` |
| Kajal Kumari (F) | `kajal-kumari.jpg` |
| Rajesh Sharma — Director (M) | `rajesh-sharma.jpg` |
