# Nicos Weg 冒险 · 生成器

在电脑上从你下载的 DW 分课资料生成整套游戏（A1 / A2 / B1）。

## 1. 准备
```
pip install pyphen pymupdf
```
（可选）装 ffmpeg 并加入 PATH，生成器会从每课视频截一帧做封面；没有也能跑。

## 2. 改路径
打开 `build.py`，把最上面 CONFIG 里的路径改成你电脑上的：
- `LEVELS`：每个等级两项 —— `lessons`（每课一个文件夹，里面有 …台词与词汇表.pdf）、`extra`（分课资料：01_语法、02_词汇、03_风土人情）
- `MEDIA_DIRS`：音频和图片所在的文件夹（_media），可以写多个
- 要加 B1 就把注释掉的那行放开

## 3. 运行
```
python build.py
```
生成 `dist/`：`index.html` + `media/` + `assets/`（城市地图图片）+ `README.md` + 空的 `.nojekyll`（让 GitHub Pages 原样发布，不跑 Jekyll）。整个 dist 上传到 GitHub Pages / Vercel / Gitee Pages 即可；也可以直接把 dist 发到 Claude 让它发布。

## 4. 翻译
第一次运行后会生成 `needs_translation.json`（没有中文的台词）。把它发给 Claude 翻译，把返回的内容合并进 `extra/translations.json`，再跑一次 `python build.py`。

## 文件说明
- `template.html`：游戏引擎（城市地图也在里面：`TOWNS` 配置每个地标负责哪几章，改 `ch` 数组就能调整）
- `../Nicos Berlin/assets/`：城市地图的地标和 Nico 图片，构建时复制到 `dist/assets/`（路径见 build.py 的 `MAP_DIR`）。首页点 A1 / A2 打开地图，点地标弹出课时列表；`index.html?lv=A1&b=park` 直接打开地图并停在公园，`?ep=A1-10` 直接进第 10 集
- `extra/A1.json`：A1 前 10 集的手写剧情、场景文案、Boss、对话（其他课自动生成）
- `extra/translations.json`：台词中文
- `extra/compounds.json`：复合词拆零件表（可以往里加）
- `extra/stress.json`：重音例外表（0 = 第一个音节）
- `extra/emoji.json`：词汇配的 emoji（没有配图的词用）
- 运行后的 `missing_media.txt`：CSV 里写了但 _media 里找不到的音频/图片
