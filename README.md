# dsh-voice-input

[中文](#中文) | [English](#english)

## 中文

为 DeepSeek Harness Web 输入框添加中英语音输入，支持中文、英文及中英混合口述。基于浏览器 Web Speech API，无服务端、无需 API Key 或本地模型。

### 安装

在 `deepseek-harness` 源码根目录执行：

```powershell
pnpm dsh plugin --profile web add github:wepar1212/dsh-voice-input#v0.1.0
```

重启 DSH Web 后，点击输入框左侧的 🎤 开始持续识别；再次点击停止，并将识别结果写入输入框。

### 限制

- 识别区域设为 `zh-CN`；中文、英文和中英混合语音的实际准确率取决于浏览器的语音识别服务。
- 需要支持 Web Speech API 的 Chrome 或 Edge。
- 语音识别可能由浏览器供应商的在线服务处理，请根据所用浏览器的隐私政策决定是否使用。
- 已在 DeepSeek Harness 源码版 `0.1.0-rc.5` 上验证。

## English

Adds Chinese and English voice input to the DeepSeek Harness Web composer, including mixed Chinese-English dictation. It uses the browser Web Speech API and requires no server, API key, or local speech model.

### Installation

Run this command from the `deepseek-harness` source root:

```powershell
pnpm dsh plugin --profile web add github:wepar1212/dsh-voice-input#v0.1.0
```

Restart DSH Web, then click the 🎤 button beside the composer to start continuous recognition. Click it again to stop and insert the transcript into the draft.

### Limitations

- The recognition locale is set to `zh-CN`; accuracy for Chinese, English, and mixed-language speech depends on the browser's recognition service.
- Chrome or Edge with Web Speech API support is required.
- Speech may be processed by your browser vendor's online service. Review the browser's privacy policy before use.
- Tested with the DeepSeek Harness `0.1.0-rc.5` source release.

## Development

```powershell
pnpm install
pnpm build
```

MIT License
