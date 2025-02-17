import { Validations } from './validations';
import { BadRequestException } from "@nestjs/common"

export class NameValidate {

    private static instance: NameValidate
    public static getInstance(): NameValidate {
        if (!NameValidate.instance) {
            NameValidate.instance = new NameValidate();
        }
        return NameValidate.instance;
    }
    private IS_NUMBER = /\d/;
    private IS_EMAIL = /^[a-zA-Z0-9._%+-]{1,50}@[a-zA-Z0-9.-]{2,26}\.[a-zA-Z]{2,13}(\.[a-zA-Z]{2,13})?$/;
    private NO_SPACE = /\s+/;
    private NO_SPECIAL_CHARACTER = /[!@#$?/*+&_,:;=%|'<>.^(){}~çãªº°´`¨¹²³£¢¬§\(\)\/\\\[\]\^\|\{\}-]/;
    private ESPECIAL_CHARACTER = /[!@#$?/*+]/
    private OTHER_ESPECIAL_CHARACTER = /[&_,:;=%|ç'<>.^(){}~¨´`ã¹²³£¢¬§°ªº\(\)\/\\\[\]\^\|\{\}-]/;
    private ONLY_POINT = /[!@#$?/*+&_,:;=%|'<>^(){}~¹²³£¢¬§\(\)\/\\\[\]\^\|\{\}-]/;
    private ONLY_HIFEN = /[!@#$?/*+&_,:;=%|'<>.^(){}~çãªº°´`¨¹²³£¢¬§\(\)\/\\\[\]\^\|\{\}]/;
    private ONLY_DEFECT = /[!@#$?*+&_:;=%|'<>^{}~çã´`¨¹²³£¢¬§]/;
    private ONLY_GRAU = /[!@#$?ç/*+&_.",:;=%|'<>¨^(){}~¹²³£¢¬§\(\)\/\\\[\]\^\|\{\}-]/;
    private EXCEPTIONS = /[@#$?*+&_=%|'<>^{}~çãªº°´`¨¹²³£¢¬§\\\\\\[\]\^\|\{\}]/;
    private OTHER_EXCEPTIONS = /[!@#$?/*+&_,:;=%|'<>.(){}~ãªº°`¨¹²³£¢¬§\(\)\/\\\[\]\^\|\{\}]/;
    private NO_UPPER = /[A-Z]/;
    private NO_LOWER = /[a-z]/;
    private NO_ACENTUATION = /[`áàãâéêíóôõúüÁÀÃÂÉÊÍÓÔÕÚÜÇ´¨]/;
    private DAYS_OF_WEEK = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    private CODES = ["M", "Q", "P", "C"]
        
    getValidName(name: string) {

        let currentName = name;

        currentName = currentName.replace(/\s+/g, " ");

        Validations.getInstance().verifyLength("nome", currentName, 5, 40);

        if (this.validate(this.NO_SPECIAL_CHARACTER, currentName)) {
            throw new BadRequestException('O nome do usuario não pode conter caracteres especiais!!');
        }
        if (this.validate(this.OTHER_ESPECIAL_CHARACTER, currentName)) {
            throw new BadRequestException('O nome do usuario não pode conter caracteres especiais!!');
        }
        if (this.validate(this.IS_NUMBER, currentName)) {
            throw new BadRequestException('O nome do usuario não pode conter números!!');
        }
        if (this.validate(this.NO_ACENTUATION, currentName)) {
            throw new BadRequestException('O nome do usuario não pode conter acentuação!!');
        }
        const treatment = name.split(' ');
        let standard_name = '';
        treatment.forEach(name => {
            name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            standard_name += name + " "
        })
        standard_name = standard_name.slice(0, standard_name.length - 1)

        return standard_name;
    }
    getValidComponent(component: string) {
        if (!(component.length >= 2 && component.length <= 20)) {
            throw new BadRequestException('O componente deve ter mínimo 2 e máximo 20 caracteres!')
        }
        if (this.validate(this.ONLY_HIFEN, component)) {
            throw new BadRequestException('O componente pode conter apenas hífen de caractere especial!!');
        }
        if (this.validate(this.NO_ACENTUATION, component)) {
            throw new BadRequestException('O componente não pode conter acento!!');
        }
        if (component.includes(' ')) throw new BadRequestException('Componente não pode conter espaços')
        return component.toUpperCase();
    }
    getValidProfile(currentName: string) {
        Validations.getInstance().verifyLength("perfil", currentName, 5, 40);

        if (this.validate(this.NO_SPECIAL_CHARACTER, currentName)) {
            throw new BadRequestException('O perfil não pode conter caracteres especiais!!');
        }
        if (this.validate(this.OTHER_ESPECIAL_CHARACTER, currentName)) {
            throw new BadRequestException('O perfil não pode conter caracteres especiais!!');
        }
        if (this.validate(this.IS_NUMBER, currentName)) {
            throw new BadRequestException('O perfil não pode conter números!!');
        }
        if (this.validate(this.NO_ACENTUATION, currentName)) {
            throw new BadRequestException('O perfil não pode conter acentuação!!');
        }
        if (currentName.split(' ').length > 2) {
            throw new BadRequestException("Nome do perfil deve conter apenas um espaço entre as palavras!");
        }
        return currentName;
    }
    getValidLogin(login: string) {

        if (login.split('.').length > 2) {
            throw new BadRequestException('O login não pode conter mais de um ponto!!');
        }
        if (login[login.length - 1] == '.') {
            throw new BadRequestException('O login não pode ser finalizado em ponto!');
        }
        if (this.validate(this.NO_SPACE, login)) {
            throw new BadRequestException('O login não pode conter espaços!!');
        }
        if (this.validate(this.IS_NUMBER, login)) {
            throw new BadRequestException('O login não pode conter números!!');
        }
        if (this.validate(this.ONLY_POINT, login)) {
            throw new BadRequestException('O login aceita apenas o caractere de ponto final!!');
        }
        if (this.validate(this.NO_ACENTUATION, login)) {
            throw new BadRequestException('O login não pode conter acentuação!!');
        }

        if (!(login.length >= 4 && login.length <= 20)) {
            throw new BadRequestException('O login deve ter mínimo 4 e máximo 20 caracteres!!');
        }


        return login;
    }
    getValidSolution(soluction: string) {
        console.log(soluction.split('-'))
        console.log(soluction.length)
        if (soluction.split('-').length > soluction.length) {
            throw new BadRequestException('Solução não pode conter apenas hifens!!')
        }
        if (!(soluction.length >= 5 && soluction.length <= 30)) {
            throw new BadRequestException('A solução deve ter no mínimo 5 e máximo 30 caracteres!')
        }
        if (this.validate(this.ONLY_HIFEN, soluction)) {
            throw new BadRequestException('A solução pode conter apenas hífen de caractere especial!!');
        }
        if (this.validate(this.NO_ACENTUATION, soluction)) {
            throw new BadRequestException('A solução não pode conter acento!!');
        }
        if (soluction.charAt(0) == ' ') {
            throw new BadRequestException("Solução não pode iniciar com espaço!");
        }
        //console.log(soluction.split('-'))
        const split = soluction.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("Não pode haver dois espaços seguidos!");
        }
        return soluction.toUpperCase();
    }
    getValidDefect(defect: string) {
        if (!(defect.length >= 2 && defect.length <= 40)) {
            throw new BadRequestException('Defeito deve ter no mínimo 2 e máximo 40 caracteres!')
        }
        if (this.validate(this.ONLY_DEFECT, defect)) {
            throw new BadRequestException('Defeito suporta apenas estes simbolos especiais: (),-./')
        }
        if (this.validate(this.NO_ACENTUATION, defect)) {
            throw new BadRequestException('Defeito não pode conter caracteres acentuados!!');
        }
        if (!this.validate(this.NO_UPPER, defect) && !this.validate(this.NO_LOWER, defect)) {
            throw new BadRequestException('Defeito deve conter letras !')
        }
        if (defect.endsWith(' ')) {
            throw new BadRequestException("Defeito não pode finalizar com espaço!")
        }
        if (defect.charAt(0) == ' ') {
            throw new BadRequestException("Nome do defeito não pode iniciar com espaço!");
        }
        const split = defect.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("Nome do defeito não pode conter dois espaços seguidos nem finalizar com espaço!");
        }
        return defect.toUpperCase();
    }
    getValidCause(cause: string) {
        if (!(cause.length >= 7 && cause.length <= 40)) {
            throw new BadRequestException('A causa deve ter no mínimo 7 e máximo 40 caracteres!')
        }
        if (cause.charAt(0) == ' ') {
            throw new BadRequestException("Causa não pode iniciar com espaço!");
        }
        if (cause.endsWith(' ')) {
            throw new BadRequestException("Causa não pode finalizar com espaço!")
        }
        const split = cause.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("Não pode haver dois espaços seguidos!");
        }
        if (this.validate(this.NO_SPECIAL_CHARACTER, cause)) {
            throw new BadRequestException('Causa não pode conter caracteres especiais!!');
        }
        if (this.validate(this.OTHER_ESPECIAL_CHARACTER, cause)) {
            throw new BadRequestException('Causa não pode conter caracteres especiais!!');
        }
        if (this.validate(this.NO_ACENTUATION, cause)) {
            throw new BadRequestException('Causa não pode conter caracteres acentuados!!');
        }
        return cause.toUpperCase();

    }
    getValidPassword(password: string) {
        if (!(password.length >= 5 && password.length <= 10)) {
            throw new BadRequestException('A senha deve ter mínimo 5 e máximo 10 caracteres!')
        }
        if (this.validate(this.NO_SPACE, password)) {
            throw new BadRequestException('A senha não deve possuir espaços!')
        }
        if (this.validate(this.OTHER_ESPECIAL_CHARACTER, password)) {
            throw new BadRequestException('A senha deve possuir apenas símbolos válidos! Ex: ! @ # $ ? / * +');
        }
        if (!this.validate(this.ESPECIAL_CHARACTER, password)) {
            throw new BadRequestException('A senha deve ter pelo menos um símbolo! Ex: ! @ # $ ? / * +');
        }
        if (!this.validate(this.NO_UPPER, password)) {
            throw new BadRequestException('A senha deve ter pelo menos uma letra maiúscula !');
        }
        if (!this.validate(this.NO_LOWER, password)) {
            throw new BadRequestException('A senha deve ter pelo menos uma letra minuscula!');
        }
        if (!this.validate(this.IS_NUMBER, password)) {
            throw new BadRequestException('A senha deve ter pelo menos um número!');
        }
        return password
    }

    getValidEmail(email: string) {
        if (!this.validate(this.IS_EMAIL, email)) {
            throw new BadRequestException('Email inválido!')
        }
        if (this.validate(this.NO_UPPER, email)) {
            throw new BadRequestException('Email não pode conter letras maiúsculas!')
        }

        return email
    }
    getValidDescription(currentName: string) {
        Validations.getInstance().verifyLength("nome", currentName, 5, 40);

        if (this.validate(this.NO_SPECIAL_CHARACTER, currentName)) {
            throw new BadRequestException('O nome não pode conter caracteres especiais!!');
        }
        if (this.validate(this.OTHER_ESPECIAL_CHARACTER, currentName)) {
            throw new BadRequestException('O nome não pode conter caracteres especiais!!');
        }
        if (this.validate(this.IS_NUMBER, currentName)) {
            throw new BadRequestException('O nome não pode conter números!!');
        }
        if (this.validate(this.NO_ACENTUATION, currentName)) {
            throw new BadRequestException('O nome não pode conter acentuação!!');
        }
        if (!this.DAYS_OF_WEEK.includes(currentName.toLowerCase())) {
            throw new BadRequestException('O dia da semana não está disponivel!!');
        }
        return currentName;
    }

    getValidShiftName(shiftName: string) {
        Validations.getInstance().validateWithRegex("nome", "IS_ALHPANUMERIC", shiftName, 5, 20);

        const oneLetter = Validations.getInstance().validRegex(/[a-zA-Z]+/g, shiftName)
        if (!oneLetter) {
            throw new BadRequestException("Nome do turno deve conter pelo menos uma letra!");
        }
        if (shiftName.charAt(0) == ' ') {
            throw new BadRequestException("Nome do turno não pode iniciar com espaço!");
        }
        if (shiftName.charAt(0) == 'º') {
            throw new BadRequestException("Nome do turno não pode iniciar com º!");
        }
        if (shiftName.charAt(0) == '°') {
            throw new BadRequestException("Nome do turno não pode iniciar com º!");
        }
        if (shiftName.includes('°')) {
            shiftName = shiftName.replace('°', 'º');
        }
        if (shiftName.split('º').length > 2) {
            throw new BadRequestException("Nome do turno deve conter apenas um º !");
        }
        if (shiftName.split(' ').length > 2) {
            throw new BadRequestException("Nome do turno deve conter apenas um espaço entre as palavras!");
        }
        if (this.validate(this.ONLY_GRAU, shiftName)) {
            throw new BadRequestException("Nome do turno não pode conter caracteres especiais, exceto o º !");
        }
        if (this.validate(this.NO_ACENTUATION, shiftName)) {
            throw new BadRequestException("Nome do turno não pode conter acentuação!");
        }


        return shiftName;
    }
    getValidShifAcronym(shiftAcronym: string) {
        if (shiftAcronym.length !== 2) {
            throw new BadRequestException('Sigla deve possuir 2 caracteres!')
        }
        if (this.validate(this.NO_SPACE, shiftAcronym)) {
            throw new BadRequestException('Sigla turno não deve possuir espaços!')
        }
        if (this.validate(this.NO_SPECIAL_CHARACTER, shiftAcronym)) {
            throw new BadRequestException("Sigla do turno não pode conter caracteres especiais!");
        }
        if (this.validate(this.OTHER_ESPECIAL_CHARACTER, shiftAcronym)) {
            throw new BadRequestException("Sigla do turno não pode conter caracteres especiais!");
        }
        if (this.validate(this.NO_ACENTUATION, shiftAcronym)) {
            throw new BadRequestException("Sigla do turno não pode conter acentuação!");
        }

        return shiftAcronym.toUpperCase();
    }
    getValidTransaction(transaction: number) {
        if (transaction == 0 || transaction == 102) return
        const secondDigit = transaction % 100;

        if (secondDigit > 52 || secondDigit < 50) throw new BadRequestException("Transação inválida!");
        if (transaction < 1000) {
            if (transaction < 150) throw new BadRequestException("Transação inválida!");
        }
        if (transaction > 1952) throw new BadRequestException("Transação inválida!");
    }

    getValidCodigo(codigo: string) {
        if (!(codigo.length >= 1 && codigo.length <= 6)) {
            throw new BadRequestException('O codigo deve ter mínimo 1 e máximo 6 caracteres!')
        }
        if (isNaN(Number(codigo))) throw new BadRequestException('O Codigo deve ser numerico!')

        if ((Number(codigo) <= 0)) throw new BadRequestException('Codigo deve ser maior que 0!')

        if (codigo.includes(' ')) throw new BadRequestException('Codigo não pode conter espaços')
        return codigo
    }
    getValidCode(codigo: string) {
        if (!(codigo.length >= 3 && codigo.length <= 5)) {
            throw new BadRequestException('O codigo deve ter mínimo 3 e máximo 5 caracteres!')
        }
        if (isNaN(Number(codigo))) throw new BadRequestException('O Codigo deve ser numerico!')
        if (Number(codigo) <= 0) throw new BadRequestException('Codigo deve ser maior que 0!')
        return codigo
    }

    getValidAbbreviation(abbreviation: string) {
        if (!(abbreviation.length >= 2 && abbreviation.length <= 10)) {
            throw new BadRequestException('A abreviação deve ter mínimo 2 e máximo 10 caracteres!')
        }
        if (abbreviation.includes(' ')) throw new BadRequestException('Abreviação não pode conter espaços')

        if (this.validate(this.NO_ACENTUATION, abbreviation)) {
            throw new BadRequestException('A abreviação do não pode conter acentuação!');
        }
        if (this.validate(this.NO_SPECIAL_CHARACTER, abbreviation)) {
            throw new BadRequestException('A abreviação não pode conter caracteres especiais!!');
        }
        if (this.validate(this.IS_NUMBER, abbreviation)) {
            throw new BadRequestException('A abreviação não pode conter números!!');
        }

        return abbreviation.toUpperCase();
    }

    getValidSupplier(supplier: string) {


        if (this.validate(this.NO_SPECIAL_CHARACTER, supplier)) {
            throw new BadRequestException('O nome fornecedor não pode conter caracteres especiais!!');
        }
        if (this.validate(this.NO_ACENTUATION, supplier)) {
            throw new BadRequestException('O nome fornecedor não pode conter acentuação!');
        }
        if (supplier.endsWith(' ')) {
            throw new BadRequestException("Fornecedor não pode finalizar com espaço!")
        }
        if (supplier.charAt(0) == ' ') {
            throw new BadRequestException("Nome do fornecedor não pode iniciar com espaço!");
        }
        if (this.validate(this.IS_NUMBER, supplier)) {
            throw new BadRequestException('O nome do fornecedor não pode conter números!!');
        }
        const split = supplier.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("Nome do fornecedor não pode conter dois espaços seguidos nem finalizar com espaço!");
        }

        if (!(supplier.length >= 2 && supplier.length <= 100)) {
            throw new BadRequestException('O nome do Fornecedor deve ter mínimo 2 e máximo 100 caracteres!')
        }

        return supplier.toUpperCase();
    }

    getValidDevice(device: string) {

        Validations.getInstance().validateWithRegex("nome", "IS_ALHPANUMERIC", device, 6, 25);

        const oneLetter = Validations.getInstance().validRegex(/[a-zA-Z]+/g, device)
        if (!oneLetter) {
            throw new BadRequestException("Nome do Dispositivo deve conter pelo menos uma letra!");
        }


        if (!(device.length >= 6 && device.length <= 25)) {
            throw new BadRequestException('Nome do Dispositivo deve ter mínimo 6 e máximo 25 caracteres!')
        }

        if (this.validate(this.OTHER_EXCEPTIONS, device)) {
            throw new BadRequestException('Nome do Dispositivo não pode conter caracteres especiais, exceto: - Ç ^ ´ ');
        }

        const split = device.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("Dispositivo não pode conter: espaço consecutivos, iniciar e nem finalizar com espaço!");
        }

        const isolatedAccents = ['´'];

        for (const accent of isolatedAccents) {
            if (device.includes(accent)) {
                throw new BadRequestException('Dispositivo não pode conter acentos isolados.');
            }
        }

        return device;
    }
    getValidLine(line: string) {

        Validations.getInstance().validateWithRegex("nome", "IS_ALHPANUMERIC", line, 3, 10);

        const oneLetter = Validations.getInstance().validRegex(/[a-zA-Z0-9]+/g, line)
        if (!oneLetter) {
            throw new BadRequestException("Nome da linha deve conter pelo menos uma letra!");
        }

        if (!(line.length >= 3 && line.length <= 10)) {
            throw new BadRequestException('Nome da linha deve ter mínimo 3 e máximo 10 caracteres!')
        }

        if (this.validate(this.NO_SPECIAL_CHARACTER, line)) {
            throw new BadRequestException('Nome da linha não pode conter caracteres especiais!');
        }

        if (line.includes(" ")) {
            throw new BadRequestException('Nome da linha não pode conter espaços!');
        }

        return line.trim();
    }

    getValidPhase(phase: string) {

        Validations.getInstance().validateWithRegex("nome", "IS_ALHPANUMERIC", phase, 3, 20);

        const oneLetter = Validations.getInstance().validRegex(/[a-zA-Z0-9]+/g, phase)
        if (!oneLetter) {
            throw new BadRequestException("Nome da fase deve conter pelo menos uma letra!");
        }

        if (!(phase.length >= 3 && phase.length <= 20)) {
            throw new BadRequestException('Nome da fase deve ter mínimo 3 e máximo 10 caracteres!')
        }

        if (!(/^[a-zA-Z0-9\s.]+$/).test(phase)) {
            throw new BadRequestException('Nome da fase não pode conter caracteres especiais! Exceto: . (ponto) e espaço');
        }


        if (this.validate(/\s{2,}/g, phase)) {
            throw new BadRequestException('Nome da fase não pode conter espaços duplos');
        }

        if (phase.trim() !== phase) {
            throw new BadRequestException('Nome da fase não pode conter espaços no início ou no fim');
        }

        return phase.trim();
    }

    getValidModel(model: string) {
        if (!(model.length >= 5 && model.length <= 10)) {
            throw new BadRequestException('Nome de modelo deve ter entre 5 e 10 caracteres!')
        }
        if (this.validate(this.ONLY_HIFEN, model)) {
            throw new BadRequestException('Nome de modelo pode conter apenas hífen de caractere especial!!');
        }
        if (model.endsWith('-')) {
            throw new BadRequestException("Modelo não pode finalizar com hífen!")
        }
        if (model.charAt(0) == '-') {
            throw new BadRequestException("Modelo não pode iniciar com hífen!");
        }
        if (model.includes(' ')) throw new BadRequestException('Nome do modelo não pode conter espaços!')
        return model.toUpperCase();
    }
    getValidIdentity(identity: string) {
        if (!(identity.length >= 2 && identity.length <= 3)) {
            throw new BadRequestException('Identificador do modelo deve ter entre 2 e 3 caracteres!')
        }
        if (this.validate(this.NO_SPECIAL_CHARACTER, identity)) {
            throw new BadRequestException('Identificador não pode conter caracteres especiais!!')
        }
        if (this.validate(this.IS_NUMBER, identity)) {
            throw new BadRequestException('Identificador não pode conter números!!');
        }

        if (identity.includes(' ')) throw new BadRequestException('Identificador não pode conter espaços!')

        return identity
    }
    getValidScheduledDescription(description: string) {
        if (!(description.length >= 3 && description.length <= 100)) {
            throw new BadRequestException('Descrição de parada deve ter entre 3 e 100 caracteres!')
        }
        if (this.validate(this.NO_SPECIAL_CHARACTER, description)) throw new BadRequestException("Descrição não pode conter caracteres especiais!");

        if (description.endsWith(' ')) {
            throw new BadRequestException("Descrição não pode finalizar com espaço!")
        }
        if (description.charAt(0) == ' ') {
            throw new BadRequestException("Descrição não pode iniciar com espaço!");
        }

        const oneLetter = Validations.getInstance().validRegex(/[a-zA-Z]+/g, description)
        if (!oneLetter) {
            throw new BadRequestException("Descrição deve conter pelo menos uma letra!");
        }
    }
    getValidScheduledCode(code: string) {
        if (!this.CODES.includes(code)) throw new BadRequestException("Tipo inválido!")
    }

    getValidStopType(type: string) {

        const oneLetter = Validations.getInstance().validRegex(/[a-zA-Z]+/g, type)
        if (!oneLetter) {
            throw new BadRequestException("O tipo deve conter pelo menos uma letra!");
        }

        return type.toUpperCase;
    }

    getValidReasonOfStop(reason: string) {

        Validations.getInstance().validateWithRegex("Motivo", "IS_ALHPANUMERIC", reason, 3, 100);

        const oneLetter = Validations.getInstance().validRegex(/[a-zA-Z]+/g, reason)
        if (!oneLetter) {
            throw new BadRequestException("Motivo deve conter pelo menos uma letra!");
        }

        if (!(reason.length >= 3 && reason.length <= 100)) {
            throw new BadRequestException('O Motivo deve ter mínimo 3 e máximo 100 caracteres!')
        }

        const split = reason.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("O Motivo não pode conter: espaço consecutivos, iniciar e nem finalizar com espaço!");
        }

        if (this.validate(this.EXCEPTIONS, reason)) {
            throw new BadRequestException('O Motivo pode conter apenas esses caracteres especiais: . , : / () ! ““ ; -');
        }

        return reason;
    }

    getValidIdentifiedCause(identifiedCause: string) {

        Validations.getInstance().validateWithRegex("cause", "IS_ALHPANUMERIC", identifiedCause, 3, 100);

        const oneLetter = Validations.getInstance().validRegex(/[a-zA-Z]+/g, identifiedCause)
        if (!oneLetter) {
            throw new BadRequestException("A causa deve conter pelo menos uma letra!");
        }

        if (!(identifiedCause.length >= 3 && identifiedCause.length <= 100)) {
            throw new BadRequestException('A causa deve ter mínimo 3 e máximo 100 caracteres!')
        }

        const split = identifiedCause.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("A Causa não pode conter: espaço consecutivos, iniciar e nem finalizar com espaço!");
        }

        if (this.validate(this.EXCEPTIONS, identifiedCause)) {
            throw new BadRequestException('A causa pode conter apenas esses caracteres especiais: . , : / () ! ““ ; -');
        }

        return identifiedCause;
    }

    getJustify(justify: string) {
        const justifyy = justify.trim();

        if(!(justifyy.length>=3 && justifyy.length<= 100)){
            throw new BadRequestException('A justificativa deve ter entre 3 e 100 caracteres!')
        }

        return justifyy;
    }

    getValidRegistryName(registryName: string) {

        const registryNameD = registryName.trim();
        if(!(registryNameD.length>=3 && registryNameD.length<= 100)) {
            throw new BadRequestException('O nome do problema deve ter entre 3 e 100 caracteres!')
        }
       
        const hasInvalidCharacters = /[^\wÀ-ÿ\s]/gu.test(registryNameD);
        if (hasInvalidCharacters) {
            throw new BadRequestException('O nome do problema deve conter somente letras, números e/ou letras com acento');
        }

        const split = registryNameD.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("O nome do problema não pode conter espaço consecutivos!");
        }
        return registryNameD
    }

    getValidRegistryDescription(registryDescription: string) {

        const registryDescriptionD = registryDescription.trim();
        if(!(registryDescriptionD.length>=3 && registryDescriptionD.length<= 100)) {
            throw new BadRequestException('A descrição do problema deve ter entre 3 e 100 caracteres!')
        }
       
        const hasInvalidCharacters = /[^\wÀ-ÿ\s]/gu.test(registryDescriptionD);
        if (hasInvalidCharacters) {
            throw new BadRequestException('A descrição do problema deve conter somente letras, números e/ou letras com acento');
        }

        const split = registryDescriptionD.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("A descrição do problema não pode conter espaço consecutivos!");
        }
        return registryDescriptionD
    }

    getCause(cause: string) {
        const causa = cause.trim();
        if(!(causa.length>=3 && causa.length<= 100)){
            throw new BadRequestException('Campo causa deve ter entre 3 e 100 caracteres!')
        }

        return causa
        
    }
    getAction(action: string) {
        const actionn = action.trim();
        if(!(actionn.length>=3 && actionn.length<= 100)) {
            throw new BadRequestException('Campo ação deve ter entre 3 e 100 caracteres!')
        }
        return actionn
    }

    getA3CauseDescripition(cause: string) {
        const causeD = cause.trim();
        if(!(causeD.length>=3 && causeD.length<= 100)) {
            throw new BadRequestException('A descrição da causa deve ter entre 3 e 100 caracteres!')
        }
       
        const hasInvalidCharacters = /[^\wÀ-ÿ\s]/gu.test(causeD);
        if (hasInvalidCharacters) {
            throw new BadRequestException('A descrição da causa deve conter somente letras, números e/ou letras com acento');
        }

        const split = causeD.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("A descrição da causa não pode conter espaço consecutivos!");
        }
        return causeD
    }

    getSoluctionDescription(description:string){
        const descriptionD = description.trim();
        if(!(descriptionD.length>=3 && descriptionD.length <= 100)){
            throw new BadRequestException('A Solução da causa deve ter entre 3 e 100 caracteres!')
        }
        const hasInvalidCharacters = /[^\wÀ-ÿ\s]/gu.test(descriptionD);
        if (hasInvalidCharacters) {
            throw new BadRequestException('A Solução da causa deve conter somente letras, números e/ou letras com acento');
        }
        const split = descriptionD.split(' ')
        if (split.includes('')) {
            throw new BadRequestException("A Solução da causa não pode conter espaço consecutivos !");
        }
        return description;
    }

    getValidWhat(what: string) {

        Validations.getInstance().validateWithRegex("'O quê'", "IS_ALHPANUMERIC", what, 3, 100);

        const characters = what.trim();
        
        const hasInvalidCharacters = /[^\wÀ-ÿ\s]/gu.test(characters);
        if (hasInvalidCharacters) {
            throw new BadRequestException('Campo "O quê" deve conter somente letras, números e/ou letras com acento');
        }

        const split = what.split(' ')
        if (split.includes('')) {
            throw new BadRequestException('Campo "O quê" não pode conter espaço consecutivos!');
        }

        return what;

    }

    getValidWhy(why: string) {

        Validations.getInstance().validateWithRegex("'Por quê'", "IS_ALHPANUMERIC", why, 3, 100);

        const characters = why.trim();
        
        const hasInvalidCharacters = /[^\wÀ-ÿ\s]/gu.test(characters);
        if (hasInvalidCharacters) {
            throw new BadRequestException('Campo "Por quê" deve conter somente letras, números e/ou letras com acento');
        }

        const split = why.split(' ')
        if (split.includes('')) {
            throw new BadRequestException('Campo "Por quê" não pode conter espaço consecutivos!');
        }

        return why;

    }

    getValidWhere(where: string) {

        Validations.getInstance().validateWithRegex("'Onde'", "IS_ALHPANUMERIC", where, 3, 100);

        const characters = where.trim();
        
        const hasInvalidCharacters = /[^\wÀ-ÿ\s]/gu.test(characters);
        if (hasInvalidCharacters) {
            throw new BadRequestException('Campo "Onde" deve conter somente letras, números e/ou letras com acento');
        }

        const split = where.split(' ')
        if (split.includes('')) {
            throw new BadRequestException('Campo "Onde" não pode conter espaço consecutivos!');
        }

        return where;

    }

    getValidHow(how: string) {

        Validations.getInstance().validateWithRegex("'Como'", "IS_ALHPANUMERIC", how, 3, 100);

        const characters = how.trim();
        
        const hasInvalidCharacters = /[^\wÀ-ÿ\s]/gu.test(characters);
        if (hasInvalidCharacters) {
            throw new BadRequestException('Campo "Como" deve conter somente letras, números e/ou letras com acento');
        }

        const split = how.split(' ')
        if (split.includes('')) {
            throw new BadRequestException('Campo "Como" não pode conter espaço consecutivos!');
        }

        return how;

    }

    getHowMuch(howMuch: number) {
    
        if ( howMuch < 0) {
            throw new BadRequestException('Você não pode cadastrar números negativos.');
        }
    
        return howMuch;
    }

    getJustification(justification: string) {
        const justificationn = justification.trim();
        if(!(justificationn.length>=3 && justificationn.length<= 100)) {
            throw new BadRequestException('Campo justificativa deve ter entre 3 e 100 caracteres!')
        }
        const split = justificationn.split(' ')
        if (split.includes('')) {
            throw new BadRequestException('Campo justificativa não pode conter espaço consecutivos!');
        }
        return justificationn
    }


    private validate(regex: RegExp, value: string): boolean {
        return regex.test(value);
    }


}


