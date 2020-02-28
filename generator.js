const generator = {
    generate: services => {
        return "var xhttp = new XMLHttpRequest();" +
            services
            .map(service => {
                const funcNames = Object.getOwnPropertyNames(
                    Object.getPrototypeOf(service.service)
                ).filter(fn => fn != "constructor");
                const functions = funcNames
                    .map(funcName => {
                        return `${funcName}: function() {
                            if ("function" != typeof arguments[arguments.length - 1]) {
                                xhttp.open("POST", "${service.route}/${funcName}", false);
                                xhttp.setRequestHeader("Content-type", "application/json");
                                xhttp.send(JSON.stringify({
                                    args: Array.from(arguments)
                                }));
                                return JSON.parse(xhttp.responseText);
                            } else {
                                const args = arguments
                                xhttp.onreadystatechange = function() {
                                    if(this.readyState == 4 && this.status == 200) {
                                        args[args.length - 1](JSON.parse(this.responseText))
                                    }
                                };
                                xhttp.open("POST", "${service.route}/${funcName}", true);
                                xhttp.setRequestHeader("Content-type", "application/json");
                                xhttp.send(JSON.stringify({
                                    args: Array.from(arguments).slice(0, arguments.length - 1)
                                }));
                            }
                        }`
                    })
                    .join(";");
                return `const ${service.service.constructor.name}={` + functions + "}";
            })
            .join(";");
    }
};

module.exports = generator;