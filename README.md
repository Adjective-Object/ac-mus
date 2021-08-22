

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
git co -b dist
rm .gitignore
git add dist
git commit -m "Initial dist subtree commit"
git subtree push --prefix dist origin gh-pages
```