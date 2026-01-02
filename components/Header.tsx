interface HeaderProps {
    title: string;
    description: string;
}
const Header = ({ title, description }: HeaderProps) => {
  return (
    <header className="header">
        <article>
            <h1>{title}</h1>
            <p>{description}</p>
        </article>
    </header>
  )
}

export default Header
