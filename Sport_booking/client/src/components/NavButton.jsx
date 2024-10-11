import {Link} from "react-router-dom";  //permette la navigazione senza ricaricare la pagina

export default function NavButton({url, icon:Icon, description, onClick}) {   //onClick funzione da eseguire al click di un pulsante

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
        // La navigazione avverrà dopo che onClick è stato eseguito
    };

    return (
        <Link to={url} onClick={handleClick}><i ></i>
            {Icon && <Icon style={{ marginRight: '8px' }} />} 
            {description}
        </Link>
    )
}