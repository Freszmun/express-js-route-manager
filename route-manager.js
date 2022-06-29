/**
 * findInRoute(parent<express|router>, type<string>, method<string>, path<string>)
 *      parent - parent route (express() or express.Router)
 *      type - endpoint or any string - any string will force router type
 *      method - lowercase endpoint method
 *      path - expected endpoint/router path
 * returns {index: number, layer: layer}
 *      index - -1 if not found
 *      layer - express layer (route or found endpoint)
 * */
function findRoute(parent, type = 'endpoint', method = 'get', path = '/') {
    let translatedName = (type === 'endpoint') ? 'bound dispatch' : 'router',
        index = 0;
    for (let layer of (parent?.stack || parent?._router?.stack || [])) {
        if (layer.name === translatedName &&
            ((layer.name === 'router' && RegExp(layer.regexp).test(path))
                || (layer.name !== 'router' && layer?.route?.methods?.hasOwnProperty(method) && layer.route.path === path))) {
            return {
                index: index,
                layer: layer
            }
        }
        index++;
    }
    return {
        index: -1,
        layer: null
    }
}

/**
 * deleteRoute(parent<express|router>, type<string>, method<string>, path<string>, throwErrors?<boolean>)
 *      parent - parent route (express() or express.Router)
 *      type - endpoint or any string - any string will force router type
 *      method - lowercase endpoint method
 *      path - expected endpoint/router path
 *      throwErrors - if route/endpoint isn't found throw error or return false
 * returns true if succeed
 * */
function deleteRoute(parent, type = 'endpoint', method = 'get', path = '/', throwErrors = true) {
    let {index} = findRoute(parent, type, method, path);
    if (index === -1) {
        if (throwErrors) throw `${method ? (method + ' ') : ''}${type} ${path} not found in ${parent?.name || 'undefined route'}`;
        return false;
    }
    (parent?.stack || parent?._router?.stack).splice(index, 1);
    return true;
}

/**
 * findRouteRecurrent(parent<express|router>, type<string>, method<string>, path<string>, limit<number>)
 *      parent - parent route (express() or express.Router)
 *      type - endpoint or any string - any string will force router type
 *      method - lowercase endpoint method
 *      path - expected endpoint/router path
 *      limit - search results limit
 * returns {
 *     list: [
 *         {parent: route, layer: layer},
 *         ...
 *     ],
 *     reamingLimit: number
 * }
 *      parent - express() | express.Router
 *      layer - express layer (route or found endpoint)
 *      reamingLimit - number of unused limit
 * */
function findRouteRecurrent(parent, type = 'endpoint', method = 'get', path = '/', limit = 1) {
    let translatedName = (type === 'endpoint') ? 'bound dispatch' : 'router',
        list = [],
        subRouteQueue = [];
    for (let layer of (parent?.stack || parent?._router?.stack || [])) {
        if (limit === 0) break;
        if (layer.name === 'router') {
            subRouteQueue.push(layer.handle);
        }
        if (layer.name === translatedName &&
            ((layer.name === 'router' && RegExp(layer.regexp).test(path))
                || (layer.name !== 'router' && layer?.route?.methods?.hasOwnProperty(method) && layer.route.path === path))) {
            list.push({
                parent: parent,
                layer: layer,
            });
            limit--;
        }
    }
    for (let route of subRouteQueue) {
        if (limit === 0) break;
        let found = findRouteRecurrent(route, type, method, path, limit);
        limit = found.reamingLimit;
        list.push(...found.list);
    }
    return {
        list: list,
        reamingLimit: limit
    };
}

/**
 * deleteSpecifiedRoute(parent<express|router>, layer<router|layer>)
 *      parent - parent route (express() or express.Router)
 *      layer - express layer (route or found endpoint)
 * */
function deleteSpecifiedRoute(parent, layer) {
    let stack = parent?.stack || parent?._router?.stack;
    stack.splice(stack.indexOf(layer), 1);
}

/**
 * getRouteByIndex(parent<express|router>, index<number>)
 *      parent - parent route (express() or express.Router)
 *      index - element index
 * returns layer
 *      layer - express layer (route or found endpoint)
 * */
function getRouteByIndex(parent, index = 0) {
    return (parent?.stack || parent?._router?.stack)[index];
}

/**
 * getRouteIndex(parent<express|router>, layer<router|layer>)
 *      parent - parent route (express() or express.Router)
 *      layer - express layer (route or found endpoint)
 * returns number
 * */
function getRouteIndex(parent, layer) {
    return (parent?.stack || parent?._router?.stack).indexOf(layer);
}

/**
 * listRoute(parent<express|router>, onlyRoutesAndEndpoints<boolean>)
 *      parent - parent route (express() or express.Router)
 *      onlyRoutesAndEndpoints - include only "router" and "bound dispatch" layers
 * returns [
 *      {type: string, path: string|null, method: string|null, layer: router|layer},
 *      ...
 * ]
 *      type - object type
 *      path - endpoint path (routes contains only layer.regexp)
 *      method - endpoint method
 *      layer - express layer (route or found endpoint)
 * */
function listRoute(parent, onlyRoutesAndEndpoints = true) {
    let list = [];
    for (let layer of (parent?.stack || parent?._router?.stack)) {
        if ((onlyRoutesAndEndpoints && (layer.name === 'router'
            || layer.name === 'bound dispatch')) || !onlyRoutesAndEndpoints) {
            list.push({
                type: layer.name,
                path: layer?.route?.path,
                method: Object.keys(layer?.route?.methods || {})[0],
                layer: layer
            });
        }
    }
    return list;
}

/**
 * treeRoute(parent<express|router>, flat<boolean>, onlyRoutesAndEndpoints<boolean>)
 *      parent - parent route (express() or express.Router)
 *      flat - make list "flat", works like Array.prototype.flat
 *      onlyRoutesAndEndpoints - include only "router" and "bound dispatch" layers
 * returns [
 *      {type: string, path: string|null, method: string|null, layer: router|layer, list: Array},
 *      ...
 * ]
 *      type - object type
 *      path - endpoint path (routes contains only layer.regexp)
 *      method - endpoint method
 *      layer - express layer (route or found endpoint)
 *      list - if flat is false it contains list of object inside this route
 * */
function treeRoute(parent, flat = false, onlyRoutesAndEndpoints = true) {
    let list = [];
    for (let layer of (parent?.stack || parent?._router?.stack)) {
        if ((onlyRoutesAndEndpoints && (layer.name === 'router'
            || layer.name === 'bound dispatch')) || !onlyRoutesAndEndpoints) {
            let obj = {
                type: layer.name,
                path: layer?.route?.path,
                method: Object.keys(layer?.route?.methods || {})[0],
                layer: layer,
            };
            if (!flat && layer.name === 'router') {
                obj.list = treeRoute(layer.handle, flat, onlyRoutesAndEndpoints);
            }
            list.push(obj);
            if (flat && layer.name === 'router') {
                list.push(...treeRoute(layer.handle, flat, onlyRoutesAndEndpoints));
            }
        }
    }
    return list;
}

module.exports = {
    findRoute: findRoute,
    deleteRoute: deleteRoute,
    findRouteRecurrent: findRouteRecurrent,
    deleteSpecifiedRoute: deleteSpecifiedRoute,
    getRouteByIndex: getRouteByIndex,
    getRouteIndex: getRouteIndex,
    listRoute: listRoute,
    treeRoute: treeRoute
}