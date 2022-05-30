
export interface EmailProviderInterface{
    sendEmailUsingTemplate(
        templateId: string,
        tos: string[],
        subject:string,
        substitutions?: Object,
        attachments?: any[],
        ccs?: string[]
    )
}