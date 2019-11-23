name: CI/CD

on: [push, pull_request]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: ['8']
    steps:
      - name: Checkout to dev branch
        uses: actions/checkout@v1
        with:
          ref: dev

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install Dependencies
        run: npm ci

      - name: Build Package
        run: npm run build
        
      - name: Clear S3
        if: github.ref == 'refs/heads/dev'
        uses: actions/aws/cli@master
        with:
          args: --endpoint-url=https://storage.yandexcloud.net s3 rm s3://www.cyber-cocks.com --recursive
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

      - name: Deploy to S3
        if: github.ref == 'refs/heads/dev'
        uses: actions/aws/cli@master
        with:
          args: --endpoint-url=https://storage.yandexcloud.net s3 cp build s3://www.cyber-cocks.com --recursive
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: 'ru-central1'
