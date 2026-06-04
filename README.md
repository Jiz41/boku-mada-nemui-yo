# ボクマダネムイヨ 専用予想データリポジトリ

## ディレクトリ構成

```
data/
├── profile.json        # 馬プロフィール・血統・兄弟馬
├── records/            # レース成績（1戦1ファイル）
├── entries/            # 出走表（レース前に追加）
└── master/
    ├── par_times.json  # 基準タイムDB
    └── course_bias.json # コースバイアスDB
```

## 運用ルール
- レース前: entries/にYYYYMMDD_競馬場_rR.jsonを追加
- レース後: records/にYYYYMMDD_競馬場_rR.jsonを追加
