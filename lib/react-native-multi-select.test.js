const react_native_multi_select = require("./react-native-multi-select")
// @ponicode
describe("shouldComponentUpdate", () => {
    let inst

    beforeEach(() => {
        inst = new react_native_multi_select.default()
    })

    test("0", () => {
        let callFunction = () => {
            inst.shouldComponentUpdate("P5", "Abruzzo")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            inst.shouldComponentUpdate("fake_project_id", "Florida")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            inst.shouldComponentUpdate("proj_", "Alabama")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            inst.shouldComponentUpdate("proj_", "Florida")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            inst.shouldComponentUpdate("fake_project", "Alabama")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            inst.shouldComponentUpdate(undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
