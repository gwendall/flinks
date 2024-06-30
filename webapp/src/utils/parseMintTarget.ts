export default function parseMintTarget(target: string) {
    const [eip, chain, contract, tokenId] = target.split(':');
    return { eip, chain, contract, tokenId };
}