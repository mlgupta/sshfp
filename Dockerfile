FROM 	alpine:latest AS builder
RUN 	apk add --no-cache 	python3 					\
							py3-yaml					\
							python3-dev					\
							bash						\
							npm							\
							openssl						\
							nginx	 					\
							openssh-client					
COPY 	modules /container
RUN 	/container/build_builder.sh

FROM 	alpine:latest
RUN 	apk add --no-cache 		python3 				\
								py3-yaml				\
								runit					\
								bash					\
								shadow					\
								openssl					\
								nginx	 				\
								openssh-client					
COPY 	container /container
COPY	--from=builder /container/out.tar.gz /container/out.tar.gz
RUN 	/container/build.sh
ENTRYPOINT ["/container/tools/run"]
# EXPOSE 80 443
