export function system() {
    return (systemClass: any) => {
        systemClass["foo"] = () => {
            console.log("SYSTEM", systemClass, "FOO");
            return systemClass;
        }
    }
}