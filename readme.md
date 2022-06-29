# express.js route manager
Simple package to manage express.js routes. You can find, delete, recurrent find route/endpoint.

Usage example in example.js file.

Finding specified route/endpoint in specified route
```
 findInRoute(parent<express|router>, type<string>, method<string>, path<string>)
      parent - parent route (express() or express.Router)
      type - endpoint or any string - any string will force router type
      method - lowercase endpoint method
      path - expected endpoint/router path
 returns {index: number, layer: layer}
      index - -1 if not found
      layer - express layer (route or found endpoint)
```
Find and delete specified route/endpoint in specified route
```
deleteRoute(parent<express|router>, type<string>, method<string>, path<string>, throwErrors?<boolean>)
     parent - parent route (express() or express.Router)
     type - endpoint or any string - any string will force router type
     method - lowercase endpoint method
     path - expected endpoint/router path
     throwErrors - if route/endpoint isn't found throw error or return false
returns true if succeed
```
Recurrent find routes/endpoints in specified route
```
findRouteRecurrent(parent<express|router>, type<string>, method<string>, path<string>, limit<number>)
     parent - parent route (express() or express.Router)
     type - endpoint or any string - any string will force router type
     method - lowercase endpoint method
     path - expected endpoint/router path
     limit - search results limit
returns {
    list: [
        {parent: route, layer: layer},
        ...
    ],
    reamingLimit: number
}
     parent - express() | express.Router
     layer - express layer (route or found endpoint)
     reamingLimit - number of unused limit
```
Delete route/endpoint inside specified route
```
deleteSpecifiedRoute(parent<express|router>, layer<router|layer>)
     parent - parent route (express() or express.Router)
     layer - express layer (route or found endpoint)
```
Get route/endpoint by its index
```
getRouteByIndex(parent<express|router>, index<number>)
     parent - parent route (express() or express.Router)
     index - element index
returns layer
     layer - express layer (route or found endpoint)
```
Get route/endpoint index
```
getRouteIndex(parent<express|router>, layer<router|layer>)
     parent - parent route (express() or express.Router)
     layer - express layer (route or found endpoint)
returns number
```
List all routes and endpoints in specified route
```
listRoute(parent<express|router>, onlyRoutesAndEndpoints<boolean>)
     parent - parent route (express() or express.Router)
     onlyRoutesAndEndpoints - include only "router" and "bound dispatch" layers
returns [
     {type: string, path: string|null, method: string|null, layer: router|layer},
     ...
]
     type - object type
     path - endpoint path (routes contains only layer.regexp)
     method - endpoint method
     layer - express layer (route or found endpoint)
```
Recurrent list all routes and endpoints in specified route
```
treeRoute(parent<express|router>, flat<boolean>, onlyRoutesAndEndpoints<boolean>)
     parent - parent route (express() or express.Router)
     flat - make list "flat", works like Array.prototype.flat
     onlyRoutesAndEndpoints - include only "router" and "bound dispatch" layers
returns [
     {type: string, path: string|null, method: string|null, layer: router|layer, list: Array},
     ...
]
     type - object type
     path - endpoint path (routes contains only layer.regexp)
     method - endpoint method
     layer - express layer (route or found endpoint)
     list - if flat is false it contains list of object inside this route
```

If you have more ideas for more features feel free to create issue.