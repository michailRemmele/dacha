Configure Git
-----------
Upon cloning the repository, make sure to enable the Git hooks:
```
rm -r .git/hooks && ln -s ../etc/git/hooks .git/hooks
```