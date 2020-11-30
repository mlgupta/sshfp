FROM 	alpine:latest
RUN 	apk add --no-cache 		python3 						\
								py3-yaml						\
								runit							\
								bash							\
								shadow							\
								openssl							\
								nginx	 						\
								openssh-client					
COPY 	container /container
RUN 	/container/build.sh
ENTRYPOINT ["/container/tools/run"]
EXPOSE 80 443
