## pingvin-share部分汉化
### 说明
简单部分汉化,仅供学习使用,随缘更新!
## 演示:
图片:
![](https://lsky.balabi.asia/i/2023/03/26/642009167f39a.png)
![](https://lsky.balabi.asia/i/2023/03/26/64200b97591c5.png)
测试demo:[pingvin-share中文测试](https://pingvin.alldreams.top/)
测试用户:`demo`
测试用户密码:`Demo123456`
测试账号并没有管理员权限!!!

## 使用方法:

zip包上传至服务器并解压
`unzip [包名]`
1. 进入项目Dockerfile所在目录
2. 构建镜像
```shell
docker build -t pingvin-share-zh_cn:v1 .
```
3. 配置容器
```shell
nano docker-compose.yml
```

参考配置:(注意镜像名的修改!!!)
```yaml
version: '3.8'
services:
  pingvin-share:
    container_name: pingvin-share
    image: pingvin-share-zh_cn:v1
    restart: unless-stopped
    ports:
      - 5677:3000     # 8080可以改成服务器上未被使用的端口
    volumes:
      - "${PWD}/data:/opt/app/backend/data"  # ${PWD}/data表示在当前目录下创建data文件夹用于存放文件

```
