
export interface EmailProviderInterface{
    sendEmails(
        templateId: any,
        tos: any,
        substitutions?: any,
        attachments?: any[],
        ccs?: any
    )
}