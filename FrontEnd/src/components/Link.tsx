
type links = { page:string }

const Link = ({page} : links) => {

    const link_ref = page.toLowerCase().replace(/ /g, "")

    return (
        {page}
    )
}