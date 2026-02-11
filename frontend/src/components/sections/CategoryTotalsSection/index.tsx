import Table from '@shared/Table'
import tableStyles from '@shared/Table/Table.module.css'
import type { CategoryTotalsReport } from '../../../types'
import styles from './CategoryTotalsSection.module.css'

type CategoryTotalsSectionProps = {
  report: CategoryTotalsReport
  formatMoney: (value: number) => string
}

export default function CategoryTotalsSection({
  report,
  formatMoney,
}: CategoryTotalsSectionProps) {
  return (
    <section className="card">
      <h2>Totais por categoria</h2>
      <Table
        headers={['Categoria', 'Receitas', 'Despesas', 'Saldo']}
        footer={
          <div className={`${tableStyles.row} ${styles.totalRow}`}>
            <span>Total geral</span>
            <span>{formatMoney(report.summary.totalIncome)}</span>
            <span>{formatMoney(report.summary.totalExpense)}</span>
            <span>{formatMoney(report.summary.balance)}</span>
          </div>
        }
      >
        {report.items.map((item) => (
          <div className={tableStyles.row} key={item.categoryId}>
            <span>{item.categoryDescription}</span>
            <span>{formatMoney(item.totalIncome)}</span>
            <span>{formatMoney(item.totalExpense)}</span>
            <span>{formatMoney(item.balance)}</span>
          </div>
        ))}
      </Table>
    </section>
  )
}
