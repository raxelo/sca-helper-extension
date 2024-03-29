declare var SC: {
    ENVIRONMENT: any
}

type ScriptStatus = {
    name: string
    status: 'loaded' | 'failed' | 'loading'
    src: string
}

type SCState = {
    touchpoint: ApplicationTouchpoint
    scriptStatuses: ScriptStatus[]
    baseUrl: string
}