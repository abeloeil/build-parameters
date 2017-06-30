# build-parameters

Build a parameters file from a dist file.

## Install

```bash
yarn add build-parameters
```

or

```bash
npm install build-parameters --save
```

## Usage

Directly in your terminal

```bash
node_modules/.bin/build-parameters /path/to/dist /path/to/parameters
```

In your package.json :

```json
{
  "scripts": {
    "build-parameters": "build-parameters </path/to/dist> <path/to/parameters>"
  }
}
```
