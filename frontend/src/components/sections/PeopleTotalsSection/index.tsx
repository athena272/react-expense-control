import Table from '@shared/Table'
import tableStyles from '@shared/Table/Table.module.css'
import type { PeopleTotalsReport } from '../../../types'
import styles from './PeopleTotalsSection.module.css'

type PeopleTotalsSectionProps = {
  report: PeopleTotalsReport
  formatMoney: (value: number) => string
}

export default function PeopleTotalsSection({
  report,
  formatMoney,
}: PeopleTotalsSectionProps) {
  return (
    <section className="card">
      <h2>Totais por pessoa</h2>
      <Table
        headers={['Pessoa', 'Receitas', 'Despesas', 'Saldo']}
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
          <div className={tableStyles.row} key={item.personId}>
            <span>{item.personName}</span>
            <span>{formatMoney(item.totalIncome)}</span>
            <span>{formatMoney(item.totalExpense)}</span>
            <span>{formatMoney(item.balance)}</span>
          </div>
        ))}
      </Table>
    </section>
  )
}
