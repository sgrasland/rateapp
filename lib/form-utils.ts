export function getFormItems(form: HTMLFormElement) {
    return Array.from(form.children)
        .map((el: Element) => Array.from(el.children))
        .flat()
        .filter((el: Element) => el.tagName.toLocaleLowerCase() === "input")
        .map( function(el: Element) {
        let formItem = Object.create(null)
        formItem.id = (el as HTMLInputElement).id;
        formItem.value = (el as HTMLInputElement).value;
        return formItem
        })
}