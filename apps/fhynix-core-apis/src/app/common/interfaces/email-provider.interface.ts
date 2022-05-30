
export interface EmailProviderInterface{
    sendEmailUsingTemplate(
        templateId: string,
        tos: any,
        subject:string,
        substitutions?: Object,
        attachments?: any[],
        ccs?: any
    )
}