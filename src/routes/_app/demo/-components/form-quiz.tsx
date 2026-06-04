import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { FormQuizSchema } from '../-types'
import type { TFormQuizSchema } from '../-types'
import { useCreateQuiz, useGetQuiz, useUpdateQuiz } from '../-api'

import { useQuery } from '@tanstack/react-query'
import {
  FormInput,
  FormTiptap,
  FormImageUpload,
  FormColorPicker,
  FormTextarea,
} from '@/components/form'
import { CardAction, CardContent } from '@/components/ui/card'
import AppLoading from '@/components/base/app-loading'

import { DEFAULT_QUIZ_DATA } from '../-data'
import type { TFormType } from '@/types'
import { useNavigate, useRouter } from '@tanstack/react-router'

type TProps = {
  form_data: { id: string | number; type: TFormType }
}

export default function FormQuiz({ form_data }: TProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const navigate = useNavigate()
  const { id, type } = form_data
  // Fetch existing quiz
  const { data: quiz, isLoading: isFetchLoading } = useQuery({
    ...useGetQuiz(id),
    enabled: !!id && type === 'update',
  })

  // Form Setup
  const form = useForm<TFormQuizSchema>({
    resolver: zodResolver(FormQuizSchema),
    defaultValues: DEFAULT_QUIZ_DATA,
  })

  const { reset, control, handleSubmit } = form

  // Format API Data
  useEffect(() => {
    if (type === 'update' && quiz) {
      reset(quiz)
    }
  }, [quiz, type, reset])

  // Mutations
  const { mutate: createQuiz, isPending: isPendingCreate } = useCreateQuiz()
  const { mutate: updateQuiz, isPending: isPendingUpdate } = useUpdateQuiz()
  // Cancel
  const handelCancel = () => {
    router.history.back()
  }
  // Submit
  const onSubmit = (data: TFormQuizSchema) => {
    if (type === 'update') {
      updateQuiz(data, {
        // onSuccess: () => {
        //   navigate({ to: "/quizzes/$id/view", params: { id: String(id) } });
        //   reset(DEFAULT_QUIZ_DATA);
        // },
      })
    } else {
      createQuiz(data, {
        onSuccess: () => {
          navigate({ to: '/demo' })
          reset(DEFAULT_QUIZ_DATA)
        },
      })
    }
  }

  return (
    <CardContent className="flex-1 flex flex-col overflow-hidden">
      <form
        id="create-quiz-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 flex-1 overflow-y-auto p-1 pr-4"
      >
        {isFetchLoading ? (
          <AppLoading />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  bg-muted/5">
              <FormInput
                name="name"
                control={control}
                label={t('quizzes.tableName')}
                placeholder={t('quizzes.form.quizNamePlaceholder')}
              />
              <FormInput
                name="title"
                control={control}
                label={t('quizzes.tableTitle')}
                placeholder={t('quizzes.form.titlePlaceholder')}
              />

              <FormInput
                name="heading"
                control={control}
                label={t('quizzes.details.heading')}
                placeholder={t('quizzes.form.headingPlaceholder')}
              />

              <FormInput
                name="cta_text"
                control={control}
                label={t('quizzes.details.ctaText')}
                placeholder={t('quizzes.form.ctaTextPlaceholder')}
              />
              <FormInput
                name="submit_button_text"
                control={control}
                label={t('quizzes.details.submitButtonText')}
                placeholder={t('quizzes.form.submitButtonTextPlaceholder')}
              />
              <FormInput
                name="result_button_text"
                control={control}
                label={t('quizzes.details.resultButtonText')}
                placeholder={t('quizzes.form.resultButtonTextPlaceholder')}
              />
              <FormImageUpload
                name="logo"
                control={control}
                label={t('quizzes.details.logo')}
                description={t('quizzes.form.logoDescription')}
              />

              <FormImageUpload
                name="background_image"
                control={control}
                label={t('quizzes.details.background')}
                description={t('quizzes.form.backgroundDescription')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  bg-muted/5">
              <FormColorPicker
                control={control}
                name="primary_color"
                label={t('quizzes.details.primaryColor')}
                placeholder="#3b82f6"
                defaultColor="#3b82f6"
              />
              <FormColorPicker
                name="secondary_color"
                control={control}
                label={t('quizzes.details.secondaryColor')}
                placeholder="#8b5cf6"
                defaultColor="#8b5cf6"
              />
            </div>
            <FormTextarea
              name="description"
              control={control}
              label={t('quizzes.tableDescription')}
              placeholder={t('quizzes.form.descriptionPlaceholder')}
            />

            <FormTiptap
              name="landing_page_text"
              control={control}
              label={t('quizzes.details.footerText')}
            />
          </div>
        )}
      </form>

      <CardAction className="pt-4 w-full flex justify-end items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="min-w-36"
          disabled={isPendingCreate || isPendingUpdate}
          onClick={handelCancel}
        >
          {t('common.cancel')}
        </Button>
        <Button
          form="create-quiz-form"
          type="submit"
          className="min-w-36"
          loading={isPendingCreate || isPendingUpdate}
        >
          {type === 'update' ? t('common.update') : t('common.create')}
        </Button>
      </CardAction>
    </CardContent>
  )
}
