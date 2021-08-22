

## dev

```sh
yarn dev # build
```

## build

```sh
yarn build
```

## deploy 
requires git-subtree (`sudo dnf install git-subtree` on fedora)

```sh
git co -b deploy
yarn build
git add dist -f
git commit -m "Initial dist subtree commit"
git subtree split --prefix dist -b gh-pages # create a local gh-pages branch
git push --force origin gh-pages:gh-pages
git co main
git branch -D deploy gh-pages
```