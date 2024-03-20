import '../scss/ConsoleLabel.scss'

export default function ConsoleLabel({ text }: { text: string }) {
    return (
        <div className='console_label'>{text}</div>
    )
}
