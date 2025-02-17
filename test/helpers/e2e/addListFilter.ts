import type { Page } from '@playwright/test'

import { expect } from '@playwright/test'
import { exactText } from 'helpers.js'
import { wait } from 'payload/shared'

import { openListFilters } from './openListFilters.js'

export const addListFilter = async ({
  page,
  fieldLabel = 'ID',
  operatorLabel = 'equals',
  value = '',
  skipValueInput,
}: {
  fieldLabel: string
  operatorLabel: string
  page: Page
  skipValueInput?: boolean
  value?: string
}) => {
  await openListFilters(page, {})

  const whereBuilder = page.locator('.where-builder')

  await whereBuilder.locator('.where-builder__add-first-filter').click()

  const conditionField = whereBuilder.locator('.condition__field')
  await conditionField.click()

  const conditionOptions = conditionField.locator('.rs__option', {
    hasText: exactText(fieldLabel),
  })

  await conditionOptions.click()
  await expect(whereBuilder.locator('.condition__field')).toContainText(fieldLabel)

  const operatorInput = whereBuilder.locator('.condition__operator')
  await operatorInput.click()
  const operatorOptions = operatorInput.locator('.rs__option')
  await operatorOptions.locator(`text=${operatorLabel}`).click()

  if (!skipValueInput) {
    const valueInput = whereBuilder.locator('.condition__value >> input')
    await valueInput.fill(value)
    await wait(100)
    await expect(valueInput).toHaveValue(value)
    const valueOptions = whereBuilder.locator('.condition__value').locator('.rs__option')
    if ((await whereBuilder.locator('.condition__value >> input.rs__input').count()) > 0) {
      await valueOptions.locator(`text=${value}`).click()
    }
  }
}
