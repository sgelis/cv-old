# Contributing

1. Install NodeJS. For Debian, follow official up-to-date instructions [here](https://github.com/nodesource/distributions/blob/master/README.md).
2. Install project dependencies. As regular user, in project directory:

```sh
npm install
```

3. After contributing, compile project. As regular user in current directory:

```sh
# Just compile
make dist

# Compile and run test server
make run

# Compile again
make clean
make dist
```

