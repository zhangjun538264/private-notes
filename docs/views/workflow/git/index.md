# Git

::: info 相关资料

- [官网](https://git-scm.com/)
- [Git 学习教程](https://learngitbranching.js.org/?locale=zh_CN)
- [Git 入门指南](https://docs.github.com/cn/get-started/getting-started-with-git)
- [Git 的奇技淫巧](https://github.com/521xueweihan/git-tips)
- [Git Extras](https://github.com/tj/git-extras) git 命令行扩展工具
- [配置 Git 处理行结束符](https://docs.github.com/cn/get-started/getting-started-with-git/configuring-git-to-handle-line-endings)
- [Git 配置多个 SSH-Key](https://gitee.com/help/articles/4229)
- 下载相关
  - [Windows 版下载镜像](https://npmmirror.com/mirrors/git-for-windows/)
:::

## 常用 Git 命令

### git clone
```sh
# 默认在当前目录下创建和版本库名相同的文件夹并下载版本到该文件夹下
git clone <远程仓库的网址>

# 指定本地仓库的目录
git clone <远程仓库的网址> <本地目录>

# -b 指定要克隆的分支，默认是master分支
git clone <远程仓库的网址> -b <分支名称> <本地目录>

# 只克隆最近一次的 commit
git clone 仓库地址 --depth 1 
```

### git config
```sh
# 查看当前的 git 配置
git config --list
git config -l

# 设置使用 git 提交时的用户名称
git config [--global] user.name "名称"

# 设置使用 git 提交时的邮箱地址
git config [--global] user.email "邮箱"
```

### git add
```sh
# 添加所有文件到暂存区
git add .

# 把指定的文件添加到暂存区中
git add <文件路径>
```

### git commit
```sh
# 提交暂存区到仓库区
git commit -m "提交信息"

# 增补提交，使用上次的 commit 信息，不添加新的 commit 记录
git commit --amend 
```

### git status
```sh
# 查看本地仓库的状态
git status
```

### git branch
```sh
# 列出本地的所有分支，当前所在分支以 "*" 标出
git branch

# 列出本地的所有分支并显示最后一次提交，当前所在分支以 "*" 标出
git branch -v

# 创建新分支(停留在当前分支)，新的分支基于上一次提交建立
git branch [分支名] 

# 列出所有远程分支
git branch -r 

# 列出所有本地分支和远程分支 
git branch -a 

# 删除本地分支
git branch -d [分支名] 

# 强制删除本地分支
git branch -D [分支名] 

# 列出所有远程分支
git branch -r 

# 修改分支名称
# 如果不指定原分支名称则为当前所在分支
git branch -m [<原分支名称>] <新的分支名称>

# 强制修改分支名称
git branch -M [<原分支名称>] <新的分支名称>
```

### git merge
```sh
# 把指定的分支合并到当前所在的分支下，并自动进行新的提交
git merge <分支名称>

# 把指定的分支合并到当前所在的分支下，不进行新的提交
git merge --no-commit <分支名称>
```

### git remote
```sh
# 显示所有远程仓库
git remote

# 显示远程仓库的详细信息，在别名后面列出URL地址
git remote -v
git remote --verbose

# 添加远程仓库
git remote add <远程仓库的别名> <远程仓库的URL地址>

# 修改远程仓库的别名
git remote rename <原远程仓库的别名> <新的别名>

# 删除远程仓库
git remote remove <远程仓库的别名>

# 查看远程仓库地址
git remote get-url <远程仓库的别名>

# 修改远程仓库的 URL 地址
git remote set-url <远程仓库的别名> <新的远程仓库URL地址>
```

### git pull
```sh
# 取回远程仓库的变化，并与本地分支合并
git pull
```

### git push
```sh
# 上传本地指定分支到远程仓库
git push <远程仓库的别名> <分支名称>

# 强制推送当前分支到远程仓库，忽略冲突
git push <远程仓库的别名> --force
git push <远程仓库的别名> -f

# 推送到指定远程仓库  
git push -u <远程仓库的别名>

# 推送到指定远程仓库和分支  
git push -u <远程仓库的别名> <分支名称>

# 删除远程分支
git push <远程仓库的别名> --delete <分支名称>
```


### git log
```sh
# 打印所有的提交记录
git log

# 打印从第一次提交到指定的提交的记录
git log <commit ID>

# 打印指定数量的最新提交的记录
$ git log -<指定的数量>

# 查看所有分支的所有操作记录（包括被删除的 commit 记录和 reset 操作）
git reflog
```

### git reset
```sh
# 撤销 commit 操作
git reset --soft HEAD~1 # git reset --soft commit_id

# 撤销 commit 和 add 操作
git reset --mixed HEAD~1 # git reset --mixed commit_id

# 撤销 commit 和 add 操作同时撤销本地已追踪内容的修改
git reset --hard HEAD~1 # git reset --hard commit_id
```

### git cherry-pick
```sh
# 将指定的提交（commit）应用于其他分支
git cherry-pick <commitHash>

# 一次转移多个提交
git cherry-pick <commitHashA> <commitHashB>

# 转移从 A 到 B 的所有提交,必须按照正确的顺序放置：提交 A 必须早于提交 B
git cherry-pick A..B  # 不包含A

git cherry-pick A^..B  # 包含A
```

[三年 Git 使用心得 & 常见问题整理](https://juejin.cn/post/6844904191203213326)

[git 命令大全 github](https://github.com/521xueweihan/git-tips)
