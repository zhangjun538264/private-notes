# git 个人使用心得记录

## 代码合并冲突解决
```sh
# 1.fetch 并切换到源分支
git fetch <源分支名>
git checkout -b <待合并分支名>

# 2.合并目标分支
git merge <仓库别名/分支名>

# 例子: pref-master-equipment: 需要合并的分支, master: 源分支,origin: 仓库别名
# git fetch origin
# git checkout -b pref-master-equipment origin/pref-master-equipment
# git merge origin/master
```

## 将一个仓库的某次提交推送到其他远程仓库
```sh
# 1.查看本地仓库已关联的远程仓库
git remote -v

# 2.关联远程仓库
git remote add <远程仓库名> <远程仓库地址>

# 3.重命名已关联的远程仓库
git remote rename <旧远程仓库名> <新远程仓库名>

# 5.推送到指定远程仓库
git push -u <远程仓库名> <本地分支名>:<远程分支名>

# 若本地分支名和远程分支名相同，可简化为：
git push -u <远程仓库名> <分支名>
```

## 将一个仓库的某次提交推送到其他远程仓库
```sh
# 1.已经推送到的远程仓库
git fetch <远程仓库名>
git checkout <commit-id>

# 2.推送到其他远程仓库
git push <其他远程仓库名> <分支名>
```
