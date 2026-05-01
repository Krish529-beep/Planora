import React from 'react'

type Props = {
    name: string;
    buttonComponet?: any;
    isSmallText?: boolean;
}

const Header = ({
    name,
    buttonComponet,
    isSmallText = false
}: Props) => {
    return <div className='mb-5 flex w-full items-center justify-between'>
        <h1 className={`${isSmallText ? "text-lg" : "text-2xl"}  font-semibold dark:text-white `}>{name}
        </h1>
        {buttonComponet}
    </div>
}

export default Header