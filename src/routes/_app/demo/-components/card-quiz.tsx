import { CardContent } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

import { useQuery } from '@tanstack/react-query'
import { useGetQuiz } from '../-api'
import AppLoading from '@/components/base/app-loading'
import { getImageUrl } from '@/utils'

type TProps = {
  form_data: { id: string | number; type: string }
}

export default function CardQuiz({ form_data }: TProps) {
  const { t } = useTranslation()
  const { data: quiz, isLoading } = useQuery(useGetQuiz(form_data.id))

  if (isLoading) {
    return <AppLoading />
  }

  if (!quiz) {
    return (
      <CardContent className="py-20 text-center text-muted-foreground">
        {t('common.noDataFound')}
      </CardContent>
    )
  }

  return (
    <CardContent className="space-y-6 overflow-y-auto">
      <div className="grid gap-6">
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">
                {t('quizzes.details.name')}
              </div>
              <div className="text-sm text-muted-foreground">
                {quiz.name || t('leads.notAvailable')}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">
                {t('quizzes.details.title')}
              </div>
              <div className="text-sm text-muted-foreground">
                {quiz.title || t('leads.notAvailable')}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">
                {t('quizzes.details.heading')}
              </div>
              <div className="text-sm text-muted-foreground">
                {quiz.heading || t('leads.notAvailable')}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">
                {t('quizzes.details.ctaText')}
              </div>
              <div className="text-sm text-muted-foreground">
                {quiz.cta_text || t('leads.notAvailable')}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">
                {t('quizzes.details.submitButtonText')}
              </div>
              <div className="text-sm text-muted-foreground">
                {quiz?.submit_button_text || t('leads.notAvailable')}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">
                {t('quizzes.details.resultButtonText')}
              </div>
              <div className="text-sm text-muted-foreground">
                {quiz?.result_button_text || t('leads.notAvailable')}
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">
              {t('quizzes.tableDescription')}
            </div>
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: quiz.description || '' }}
            />
          </div>
          <div>
            <div className="text-sm font-medium">
              {t('quizzes.details.footerText')}
            </div>
            <div
              className="text-sm text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: quiz.landing_page_text || '' }}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">
            {t('quizzes.details.design')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">
                {t('quizzes.details.logo')}
              </div>
              {quiz.logo ? (
                <img
                  src={getImageUrl(quiz.logo)}
                  alt="Logo"
                  className="max-h-32 rounded-md border"
                />
              ) : (
                <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    {t('quizzes.details.noLogo')}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-medium mb-2">
                {t('quizzes.details.background')}
              </div>
              {quiz.background_image ? (
                <img
                  src={getImageUrl(quiz.background_image)}
                  alt="Background"
                  className="max-h-32 rounded-md border"
                />
              ) : (
                <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    {t('quizzes.details.noBackground')}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">
                {t('quizzes.details.primaryColor')}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: quiz.primary_color }}
                ></div>
                <span className="text-sm">{quiz.primary_color}</span>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">
                {t('quizzes.details.secondaryColor')}
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-md border"
                  style={{ backgroundColor: quiz.secondary_color }}
                ></div>
                <span className="text-sm">{quiz.secondary_color}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">{t('quizzes.questions')}</h3>
            <Badge variant="outline">
              {quiz.questions?.length || 0} {t('quizzes.questions')}
            </Badge>
          </div>

          {quiz.questions && quiz.questions.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {quiz.questions.map((question: any, index: number) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      {question.question_text}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 space-y-4">
                      {question.image && (
                        <img
                          src={getImageUrl(question.image)}
                          alt="Question"
                          className="max-h-40 rounded-md border"
                        />
                      )}
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {t('quizzes.details.answersAndPoints')}
                        </div>
                        <div className="grid gap-2">
                          {question.answers?.map(
                            (answer: any, ansIndex: number) => (
                              <div
                                key={ansIndex}
                                className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-transparent hover:border-muted-foreground/20 transition-colors"
                              >
                                <span className="text-sm">
                                  {answer.answer_text}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="font-mono"
                                >
                                  {answer.points} {t('quizzes.points')}
                                </Badge>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
              {t('quizzes.details.noQuestions')}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">
              {t('quizzes.resultPages')}
            </h3>
            <Badge variant="outline">
              {quiz.resultPages?.length || 0} {t('quizzes.pages')}
            </Badge>
          </div>

          {quiz.resultPages && quiz.resultPages.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {quiz.resultPages.map((page: any, index: number) => (
                <AccordionItem key={index} value={`page-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <span className="flex items-center gap-2">
                      <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      {page.title} ({page.min_score} - {page.max_score}{' '}
                      {t('quizzes.points')})
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 space-y-2">
                      <div
                        className="text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: page.content || '' }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
              {t('quizzes.details.noResultPages')}
            </div>
          )}
        </section>

        {(quiz.leadFormSetting || quiz.resultDeliverySetting) && (
          <section className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              {t('common.settings')}
            </h3>
            {quiz.leadFormSetting && (
              <div className="space-y-2">
                <div className="text-sm font-medium">
                  {t('quizzes.details.leadFormFields')}
                </div>
                <div className="flex flex-wrap gap-2">
                  {quiz.leadFormSetting.fields
                    .filter((field: any) => field.enabled)
                    .map((field: any, i: number) => (
                      <Badge key={i} variant="secondary">
                        {field.label}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
            {quiz.resultDeliverySetting && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium">
                    {t('quizzes.details.emailResult')}
                  </div>
                  <Badge
                    variant={
                      quiz.resultDeliverySetting.enable_email_result
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {quiz.resultDeliverySetting.enable_email_result
                      ? t('common.enabled')
                      : t('common.disabled')}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {t('quizzes.details.pdfDownload')}
                  </div>
                  <Badge
                    variant={
                      quiz.resultDeliverySetting.enable_pdf_download
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {quiz.resultDeliverySetting.enable_pdf_download
                      ? t('common.enabled')
                      : t('common.disabled')}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {t('quizzes.details.linkShare')}
                  </div>
                  <Badge
                    variant={
                      quiz.resultDeliverySetting.enable_link_share
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {quiz.resultDeliverySetting.enable_link_share
                      ? t('common.enabled')
                      : t('common.disabled')}
                  </Badge>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </CardContent>
  )
}
