const generator = require('./generator')

class ServiceRegistry {
    services = []
    router = require('express').Router();

    constructor() {}

    register(rootPath, service) {
        this.services.push({ route: rootPath, service })
    }

    serve() {
        var generated_js = generator.generate(this.services)
        this.router.get("/@generated.js", (req, res) => res.send(generated_js));
        this.services.forEach(service => {
            const funcNames = Object.getOwnPropertyNames(
                Object.getPrototypeOf(service.service)
            ).filter(fn => fn != "constructor");

            funcNames.forEach(funcName => {
                const path = service.route + '/' + funcName

                this.router.post(path, (req, res) => {
                    const result = service.service[funcName](...req.body.args)
                    res.json(result)
                })
            })
        })
    }
}

module.exports = {
    ServiceRegistry
};