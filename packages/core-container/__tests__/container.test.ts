import "jest-extended";

import { Container } from "../src/container";
import { BindingAlreadyExists, InstanceAlreadyExists } from "../src/errors";

class Person {
    private name: string = "John Doe";
}

let container;
beforeEach(() => {
    container = new Container();
});

describe("Container", () => {
    describe("constructor", () => {
        it("should create a new Map for every type of binding", () => {
            ["Resolved", "Bindings", "MethodBindings", "Instances", "Aliases"].forEach(key => {
                expect(container[`get${key}`]()).toBeInstanceOf(Map);
            });
        });
    });

    describe("has", () => {
        test.each(["getResolved", "getBindings", "getMethodBindings", "getInstances", "getAliases"])(
            "%s should return a map",
            method => {
                expect(container[method]()).toBeInstanceOf(Map);
            },
        );
    });

    describe("has", () => {
        test.each([
            "bound",
            "has",
            "hasResolved",
            "hasResolved",
            "hasBinding",
            "hasMethodBinding",
            "hasInstance",
            "hasAlias",
        ])("%s should return false after calling %s", method => {
            expect(container[method]("key")).toBeFalse();
        });

        test.each([
            [null, "register", "bound"],
            [null, "register", "has"],
            ["getResolved", "set", "hasResolved"],
            ["getBindings", "set", "hasBinding"],
            ["getMethodBindings", "set", "hasMethodBinding"],
            ["getInstances", "set", "hasInstance"],
            ["getAliases", "set", "hasAlias"],
        ])("%s should return true after calling %s", (getter, setter, has) => {
            setter = getter ? container[getter]()[setter]("key", "value") : container[setter]("key", "value");

            expect(container[has]("key")).toBeTrue();
        });
    });

    describe("isResolved", () => {
        const instance = new Person();

        it("should not be resolved", () => {
            expect(container.isResolved("key")).toBeFalse();
        });

        it("should be resolved", () => {
            container.register("key", instance);

            expect(container.isResolved("key")).toBeFalse();

            container.resolve("key");

            expect(container.isResolved("key")).toBeTrue();
        });
    });

    describe("isAlias", () => {
        it("should not be an alias", () => {
            expect(container.isAlias("key")).toBeFalse();
        });

        it("should be an alias", () => {
            container.alias("abstract", "alias");

            expect(container.isAlias("alias")).toBeTrue();
        });
    });

    describe("bind", () => {
        it("should bind the value if not set", () => {
            container.bind("key", "value");

            expect(container.getBindings().size).toBe(1);
        });

        it("should fail to bind the value if already set", () => {
            container.bind("key", "value");

            expect(container.getBindings().size).toBe(1);

            expect(() => {
                container.bind("key", "value");
            }).toThrowError(BindingAlreadyExists);
        });

        it("should overwrite the value if already set", () => {
            container.bind("key", "value");

            expect(container.getBindings().size).toBe(1);
            expect(container.getBinding("key")).toBe("value");

            container.bind("key", "new-value", false, true);

            expect(container.getBindings().size).toBe(1);
            expect(container.getBinding("key")).toBe("new-value");
        });
    });

    describe("bindIf", () => {
        it("should bind the value if not set", () => {
            container.bindIf("key", "value");

            expect(container.getBindings().size).toBe(1);
        });

        it("should fail to bind the value if already set", () => {
            container.bind("key", "value");

            expect(container.getBindings().size).toBe(1);

            container.bindIf("key", "value");

            expect(container.getBindings().size).toBe(1);
        });
    });

    // describe("bindMethod", () => {});
    // describe("callMethodBinding", () => {});

    describe("singleton", () => {
        it("should pass to set the instance", () => {
            container.singleton("key", Person);

            expect(container.getBindings().size).toBe(1);
        });

        it("should fail to set the instance", () => {
            container.singleton("key", Person);

            expect(() => {
                container.singleton("key", Person);
            }).toThrowError(BindingAlreadyExists);
        });
    });

    describe("instance", () => {
        const instance = new Person();

        it("should pass to set the instance", () => {
            container.instance("key", instance);

            expect(container.getInstances().size).toBe(1);
        });

        it("should fail to set the instance", () => {
            container.instance("key", instance);

            expect(() => {
                container.instance("key", instance);
            }).toThrowError(InstanceAlreadyExists);
        });
    });

    describe("alias", () => {
        it("should create a new alias", () => {
            container.alias("key", "value");

            expect(container.getAliases().size).toBe(1);
        });
    });

    // describe("call", () => {});
    // describe("factory", () => {});
    // describe("makeWith", () => {});
    // describe("make", () => {});
    // describe("get", () => {});
    // describe("build", () => {});
    // describe("getAlias", () => {});

    describe("forget", () => {
        test.each([
            ["getResolved", "forgetResolved"],
            ["getBindings", "forgetBinding"],
            ["getMethodBindings", "forgetMethodBinding"],
            ["getInstances", "forgetInstance"],
            ["getAliases", "forgetAlias"],
        ])("%s should be forgotten after calling %s", (collection, forget) => {
            container[collection]().set("key", "value");

            expect(container[collection]().size).toBe(1);

            container[forget]("key");

            expect(container[collection]().size).toBe(0);
        });
    });

    describe("flush", () => {
        it("should flush all maps", () => {
            container.getResolved().set("key", "value");
            container.getBindings().set("key", "value");
            container.getMethodBindings().set("key", "value");
            container.getInstances().set("key", "value");
            container.getAliases().set("key", "value");

            expect(container.getResolved().size).toBe(1);
            expect(container.getBindings().size).toBe(1);
            expect(container.getMethodBindings().size).toBe(1);
            expect(container.getInstances().size).toBe(1);
            expect(container.getAliases().size).toBe(1);

            container.flush();

            expect(container.getResolved().size).toBe(0);
            expect(container.getBindings().size).toBe(0);
            expect(container.getMethodBindings().size).toBe(0);
            expect(container.getInstances().size).toBe(0);
            expect(container.getAliases().size).toBe(0);
        });

        test.each([
            ["getResolved", "flushResolved"],
            ["getBindings", "flushBindings"],
            ["getMethodBindings", "flushMethodBindings"],
            ["getInstances", "flushInstances"],
            ["getAliases", "flushAliases"],
        ])("%s should be empty after calling %s", (collection, flush) => {
            container[collection]().set("key", "value");

            expect(container[collection]().size).toBe(1);

            container[flush]();

            expect(container[collection]().size).toBe(0);
        });
    });
});
