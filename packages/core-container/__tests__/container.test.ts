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

    describe("getResolved", () => {
        it("should return a map", () => {
            expect(container.getResolved()).toBeInstanceOf(Map);
        });
    });

    describe("getBindings", () => {
        it("should return a map", () => {
            expect(container.getBindings()).toBeInstanceOf(Map);
        });
    });

    describe("getMethodBindings", () => {
        it("should return a map", () => {
            expect(container.getMethodBindings()).toBeInstanceOf(Map);
        });
    });

    describe("getInstances", () => {
        it("should return a map", () => {
            expect(container.getInstances()).toBeInstanceOf(Map);
        });
    });

    describe("getAliases", () => {
        it("should return a map", () => {
            expect(container.getAliases()).toBeInstanceOf(Map);
        });
    });

    // describe("bound", () => {});

    describe("hasResolved", () => {
        it("should pass to resolve", () => {
            expect(container.hasResolved("key")).toBeFalse();
        });

        it("should fail to resolve", () => {
            container.getResolved().set("key", "value");

            expect(container.hasResolved("key")).toBeTrue();
        });
    });

    describe("hasBinding", () => {
        it("should pass to resolve", () => {
            expect(container.hasBinding("key")).toBeFalse();
        });

        it("should fail to resolve", () => {
            container.getBindings().set("key", "value");

            expect(container.hasBinding("key")).toBeTrue();
        });
    });

    describe("hasMethodBinding", () => {
        it("should pass to resolve", () => {
            expect(container.hasMethodBinding("key")).toBeFalse();
        });

        it("should fail to resolve", () => {
            container.getMethodBindings().set("key", "value");

            expect(container.hasMethodBinding("key")).toBeTrue();
        });
    });

    describe("hasInstance", () => {
        it("should pass to resolve", () => {
            expect(container.hasInstance("key")).toBeFalse();
        });

        it("should fail to resolve", () => {
            container.getInstances().set("key", "value");

            expect(container.hasInstance("key")).toBeTrue();
        });
    });

    describe("hasAlias", () => {
        it("should pass to resolve", () => {
            expect(container.hasAlias("key")).toBeFalse();
        });

        it("should fail to resolve", () => {
            container.getAliases().set("key", "value");

            expect(container.hasAlias("key")).toBeTrue();
        });
    });

    describe("has", () => {
        it("should pass to resolve", () => {
            expect(container.has("key")).toBeFalse();
        });

        it("should fail to resolve", () => {
            container.register("key", "value");

            expect(container.has("key")).toBeTrue();
        });
    });

    // describe("isResolved", () => {});
    // describe("isAlias", () => {});

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
            expect(container.getBindings().get("key")).toBe("value");

            container.bind("key", "new-value", false, true);

            expect(container.getBindings().size).toBe(1);
            expect(container.getBindings().get("key")).toBe("new-value");
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
    // describe("forgetInstance", () => {});
    // describe("forgetInstances", () => {});
    // describe("flush", () => {});
});
