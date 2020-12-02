
SSHFP is SSHFP tester. It will list SSHFP records, SSH Key Fingerprints for a server, and matching Key fingerprints between the published DNS SSHFP records and Fingerprints returned by the SSH server. SSHFP records are obtained by performing DNS lookup against the domain's authoritative name servers, so changes to SSHFP records should show up instantly. This tool extracts SSH Key Fingerprints using ssh-keyscan against the server and port. Result also includes a set of matching keys between published DNS SSHFP records and Key fingerprints returned by the SSH server. You should use DNSSEC when publishing SSHFP records. And, you should only perform this test against the server you own.

## Installation/Build
Follow the steps to build docker image using source code:
1. Clone this git repository
```console
$ git clone https://github.com/dbsentry/sshfp.git
```
2. By default Makefile creates image as dbsentry/sshfp. To change, modify Makefile
3. Change .release to reflect correct tag on docker image
4. Run build
```console
$ make build
```
The generated image when run would start a docker container with all the services.

## Run
You can use either docker or podman to run this container.
```console
$ docker run -p 8080:80 -it dbsentry/sshfp
```

```console
$ podman run -p 8080:80 -it dbsentry/sshfp
```

By default the webserver uses port 80 on the container, if you want to use other port:
```console
$ docker run -p 8080:8080 --env PORT=8080 -it dbsentry/sshfp
```
```console
$ podman run -p 8080:8080 --env PORT=8080 -it dbsentry/sshfp
```

## License
All assets and code are under the GNU GPL LICENSE and in the public domain unless specified otherwise.

Some files were sourced from other open source projects and are under their terms and license.
