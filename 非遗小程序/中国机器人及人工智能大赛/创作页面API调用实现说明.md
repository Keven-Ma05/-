# 创作页面API调用实现说明

## 实现概述

根据用户需求，我已经成功将创作页面的图片生成功能从模拟数据替换为真实的火山引擎API调用。现在用户在创作页面点击"生成图片"按钮时，会调用真实的AI服务生成图片。

## API调用位置

API调用代码位于**`miniprogram/pages/create/create.js`**文件中的**`generateImage`**函数（第123-214行）。

## 核心实现代码

### 1. 获取API密钥

```javascript
// 获取火山引擎API密钥
const app = getApp();
const apiKey = app.globalData.aiConfig.huoshanArkKey;
```

API密钥存储在**`app.js`**文件的全局数据中，便于统一管理和维护。

### 2. 构建请求参数

```javascript
// 构建请求参数
const requestData = {
  model: 'stable-diffusion',
  prompt: this.data.textPrompt || '传统中国风格图片',
  negative_prompt: '低质量, 模糊, 变形',
  width: 512,
  height: 512,
  n: 1,
  style: this.data.selectedStyle,
  steps: 50,
  cfg_scale: this.data.creativity / 10
};
```

参数说明：
- `model`: 使用的AI模型（稳定扩散模型）
- `prompt`: 用户输入的创作描述
- `negative_prompt`: 负面提示词，避免生成低质量图片
- `width/height`: 生成图片的尺寸
- `style`: 用户选择的艺术风格
- `steps`: 生成步数，影响图片质量
- `cfg_scale`: 创造力参数，由用户的滑块设置转换而来

### 3. 支持两种创作模式

```javascript
// 根据创作模式调整请求参数
if (this.data.createMode === 'img2img' && this.data.uploadedImage) {
  // 图生图模式
  requestData.init_image = this.data.uploadedImage;
  requestData.mode = 'img2img';
} else {
  // 文生图模式
  requestData.mode = 'text2img';
}
```

### 4. API请求实现

```javascript
// 调用火山引擎文生图API
wx.request({
  url: 'https://ark.cn-beijing.volces.com/api/v3/images/generations',
  method: 'POST',
  header: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  },
  data: requestData,
  timeout: 30000, // 30秒超时
  success: (res) => {
    // 处理成功响应
  },
  fail: (err) => {
    // 处理错误响应
  }
});
```

## 错误处理机制

实现了完善的错误处理机制，根据不同错误类型提供友好提示：

- **网络错误**：提示"网络错误，请稍后重试"
- **超时错误**：提示"生成超时，请检查网络或尝试更简单的描述"
- **API密钥错误**：提示"API密钥错误，请检查配置"
- **其他错误**：提供相应的错误提示信息

## 使用方法

1. **进入创作页面**：点击底部导航栏的"创作"图标
2. **选择创作模式**：文生图或图生图
3. **输入创作描述**（文生图模式）：描述您想要生成的图片内容
4. **上传参考图片**（图生图模式）：上传一张参考图片
5. **选择艺术风格**：从风格列表中选择喜欢的风格
6. **调整创造力**：通过滑块调整生成图片的创造力
7. **点击生成按钮**：系统会调用真实的AI服务生成图片
8. **查看生成结果**：生成完成后，图片会显示在结果区域

## 注意事项

### 1. API密钥配置

确保**`app.js`**中的火山引擎API密钥正确配置：

```javascript
huoshanArkKey: 'ark-c6c27b05-bc27-4d5d-9bb5-d919e6987af6-44543'
```

### 2. 安全域名配置

在微信公众平台的小程序管理后台配置以下安全域名：
- **request合法域名**：`https://ark.cn-beijing.volces.com`
- **downloadFile合法域名**：`https://ark.cn-beijing.volces.com`

### 3. 网络环境

确保设备有稳定的网络连接，生成图片需要消耗一定的网络流量和时间。

### 4. 创作描述

- 创作描述越详细，生成的图片越符合预期
- 建议使用中文描述，结合中国传统文化元素
- 避免使用过于复杂或模糊的描述

## 后续优化建议

1. **添加生成进度显示**：显示图片生成的实时进度
2. **实现批量生成**：支持一次生成多张图片供用户选择
3. **添加图片编辑功能**：对生成的图片进行简单的编辑（如裁剪、滤镜等）
4. **优化错误处理**：提供更详细的错误信息和解决方案
5. **添加历史记录**：保存用户的生成历史，方便查看和管理
6. **实现图片分享**：支持将生成的图片分享到微信好友或朋友圈

## 技术支持

如果您在使用过程中遇到任何问题，或者需要进一步的功能开发和优化，请随时联系我。我可以提供以下支持：

- API配置和调试
- 功能扩展和优化
- 性能优化
- 错误排查和修复
- 技术文档编写

祝您的项目顺利进行！