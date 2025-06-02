interface MinimalRouteConfig {
    method: string;
    path: string;
}

/**
 * Returns the raw route string for a given route configuration.
 * @param route - The route configuration
 * @returns The raw route string
 */
export function getRawRoute(route: MinimalRouteConfig): string {
    return `${route.method.toUpperCase()} ${route.path}`
}
