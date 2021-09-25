---
title: docker 学习记录坑
date: 2021-9-25
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
- 首先是git actions的使用，可以通过secrets定义密钥变量，然后在`.github\workflows\xx.yml`文件中使用。
- Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?报错。这个东西我暂时看不懂，应该是网络方面的错误吧。
解决方法：
只需要重启一下daemon即可。
```
systemctl daemon-reload
sudo service docker restart
sudo service docker status 
```
- 然后就是连接阿里云镜像仓库的各种报错信息。这里一定要结合仓库上面的一些例子来编写yml。
- 然后就是连接私有服务器的各种报错。这里我也不多说了，按照错误提示来debug就好了。

yml文件的编写我打算以后再慢慢的研究，总而言之终于把这个CI给弄好了。