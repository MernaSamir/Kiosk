export const Location = {
    name: 'location',
    type: 'tree_select',
    value: "name",
    multiple: false,
    selectParent: false,
    filter: {
        key: 'Filter',
        params: {
            _type: 'sb'
        }
    },
    tree: {
        reduxName: 'licensing__chain',
        child: {
            reduxName: 'licensing__location',
            match: 'chain'
        }
    },
}

export const service = {
    name: 'sp',
    type: 'select',
    value: "name",
    reduxName: 'service_provider'
}