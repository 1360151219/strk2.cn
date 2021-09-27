---
title: docker 学习记录坑
date: 2021-9-26
categories:
  - 运维
author: 盐焗乳鸽还要砂锅
tags:
  - 运维
---

自从自己买了一台阿里云服务器后，我只会用 finalshell、宝塔可视化面板来对服务器进行基本操作，我觉得这太逊啦~~看了学长的运维成果，我也挺感兴趣的，于是自己也去学习 docker，这里记录一下遇到的坑。

### 9.18

这里一开始我数据卷挂载一个 html 到 tomcat 上，可是服务器访问的时候怎么都不会显示这个 html 文件，而是现在默认的。我查了一下，是因为 tomcat 默认是访问目录是 ROOT。

另外一个问题就是，我把 html 放在了 webapps 文件夹下的一个 exam 文件夹里，我需要在 url 拼接上路径才能访问对。如`strk2.cn:8082/exam`

注意，在服务器上开放端口后，也要去阿里云控制台开放安全组噢

### 9.19

今天在学习如何部署 nginx 集群。集群就是访问一台服务器，可以把流量分发给多台服务器

关键在于 2 个点:

```js
http {
   // ......
   //集群配置：这里比如我要分发给2台服务器
	upstream nginxcluster{
		server 47.106.198.203:8082;
		server 47.106.198.203:8083;
	}

}
```

```js
server {
   //...
    location / {
    	   root html;
    	   index index.html index.htm;
        proxy_pass http://nginxcluster; //这里注意和上面定义的stream要一样
    }
}
```

然后在部署的时候遇到一些小问题，可以通过`docker logs 容器名`来找到错误问题。

### ~9.22

这几天学习了一些 Dockerfile 的命令：`FROM`、`ENV`、`RUN`、`COPY`等...
以及通过 docker build -t [NAME] . 来构建一个镜像。

> [注]：这里一定要加一个点，表示是以当前目录下的 Dockerfile 文件来构建。

### 9.25

今天我做了自动部署流程。遇到了不少的困难，记录一下。

- 首先是 git actions 的使用，可以通过 secrets 定义密钥变量，然后在`.github\workflows\xx.yml`文件中使用。
- Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?报错。这个东西我暂时看不懂，应该是网络方面的错误吧。
  解决方法：
  只需要重启一下 daemon 即可。

```yml
systemctl daemon-reload
sudo service docker restart
sudo service docker status
```

- 然后就是连接阿里云镜像仓库的各种报错信息。这里一定要结合仓库上面的一些例子来编写 yml。
- 然后就是连接私有服务器的各种报错。这里我也不多说了，按照错误提示来 debug 就好了。

yml 文件的编写我打算以后再慢慢的研究，总而言之终于把这个 CI 给弄好了。

### 9.26

今天想尝试将博客的 ci 自动化流程弄好，但是还是失败了，准确来说是只弄了一半吧。

- 首先是 yml 文件以及 Dockerfile 中的根目录环境是不一样的
- 现在我只能在本地先 build，然后再通过 Dockerfile COPY，我尝试在 Dockerfile 中写入 build，然后发现 npm install 就得等 15min？这也太慢了吧，而且还有各种报错信息，都是路径的问题。哎，给我弄吐了，先这样吧以后再完善。总而言之现在我的博客也不需要 finalshell 来连接服务器然后手动上传了。这也算是进步一丢丢吧。

### 9.27

我宣布，本博客的 CI 自动化部署流程终于弄好了。今天又有点不甘心于是继续尝试，我看了一下我们团队 email 微服务以前的 Dockerfile 文件，发现采用了 2 个 FROM，于是我也学着写了一下。

```yml
FROM node:alpine as builder
WORKDIR /var/www/blog/
COPY . /var/www/blog/
RUN npm install --registry=https://registry.npm.taobao.org

RUN npm run build

FROM nginx:alpine as server

COPY --from=builder nginx.conf /etc/nginx/nginx.conf
```

然后居然报错：`nginx.conf not found!`

我上百度也搜了一下，但是找不到问题所在。然后继续看学长之前写的 Dockerfile，发现最后一句的 COPY 的源文件目录会不会应该是在 node 环境中的目录呢？于是我改成了:`COPY --from=builder /var/www/blog/nginx.conf /etc/nginx/nginx.conf`

果然 CI 流程成功运行了。我开心的打开博客一看，居然报 Nginx server error 500

于是我打开 docker 想进入容器，发现报错:`OCI runtime exec failed: exec failed: container_linux.go:344: starting container process caused "exec: \"/bin/bash\": stat /bin/bash: no such file or directory": unknown`。 咱也看不懂啊，百度一查，将进入容器的命令改为 sh 即可，进入之后，发现熟悉的 nginx 环境没有了，我突然就想到了是我刚刚构建 nginx 的时候只复制了`nginx.conf`,并没有复制 html 文件。于是灵感大发重新改了配置：

```yml
FROM node:latest as builder
COPY . .
RUN npm config set -g registry https://registry.npm.taobao.org
RUN npm install

RUN npm run build

FROM nginx:alpine as server

COPY --from=builder nginx.conf /etc/nginx/nginx.conf
COPY --from=builder public /var/www/blog/
WORKDIR /var/www/blog/
```

终终终终于成功啦....我的博客终于也可以自动化部署了。而且是应用了 docker 技术，而不是手动上传文件。。
