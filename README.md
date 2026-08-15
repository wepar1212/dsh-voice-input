# dsh-voice-input

为 DeepSeek Harness Web 输入框添加中文语音输入。基于浏览器 Web Speech API，无服务端、无需 API Key 或本地模型。

## 安装

在 `deepseek-harness` 源码根目录执行：

```powershell
pnpm dsh plugin --profile web add github:wepar1212/dsh-voice-input
```

重启 DSH Web 后，点击输入框左侧的 🎤 开始持续识别；再次点击停止，并将识别结果写入输入框。

## 限制

- 当前识别语言固定为 `zh-CN`。
- 需要支持 Web Speech API 的 Chrome 或 Edge。
- 语音识别可能由浏览器供应商的在线服务处理；请根据所用浏览器的隐私政策决定是否使用。
- 已在 DeepSeek Harness 源码版 `0.1.0-rc.5` 上验证。

## 开发

```powershell
pnpm install
pnpm build
```

MIT License
