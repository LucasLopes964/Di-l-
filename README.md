# Inteli - Instituto de Tecnologia e Liderança 

<p align="center">
<a href= "https://www.inteli.edu.br/"><img src="/assets/inteli.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0"></a>
</p>

# Nome do projeto

## Nome do grupo

## :student: Integrantes: 
- <a href="https://www.linkedin.com/in/aira-mel-76325734a/">Aira Mel</a>
- <a href="https://www.linkedin.com/in/caio-mota-78983732a/">Caio Mota</a>
- <a href="https://www.linkedin.com/in/jos%C3%A9-lima-684597301/">José Lima</a> 
- <a href="https://www.linkedin.com/in/lucas-lopes-8072b235a/">Lucas Lopes</a> 
- <a href="https://www.linkedin.com/in/sara-sbardelotto/">Sara Sbardelotto</a>
- <a href="https://www.linkedin.com/in/teodoroneira/">Teodoro Neira</a> 
- <a href="https://www.linkedin.com/in/yudi-omaki/">Yudi Omaki</a>

## :teacher: Professores:
### Orientador(a) 
- <a href="https://www.linkedin.com/in/profclaudioandre/">Cláudio Fernando André</a>
### Instrutores
- <a href="https://github.com/anacris-inteli">Ana Cristina dos Santos</a>
- <a href="https://github.com/brunamayer">Bruna Mayer Costa</a>
- <a href="https://www.linkedin.com/in/diogo-martins-gon%C3%A7alves-de-morais-96404732/">Diogo Martins Gonçalves de Morais</a>
- <a href="https://www.linkedin.com/in/henrique-mohallem-paiva-6854b460/">Henrique Mohallem Paiva</a>
- <a href="https://www.linkedin.com/in/kizzyterra/">Kizzy Fernanda Terra Ferreira da Paz</a>


## 📝 Descrição

* O grupo **CLOUDing** visa desenvolver uma aplicação web para o Laboratório de Tecnologia e Desempenho e Sistemas Construtivos (LTDC), da área de Habitação e Edificações no IPT, com o objetivo de simplificar, integrar e otimizar as inspeções prediais - atualmente realizadas de forma manual e lenta. A solução proposta visa comportar tanto os registros por meio de fotos e descrições das irregularidades de obras e edifícios, quanto a opção de exportar tais informações. O que é viabilizado pelo uso de banco de dados, responsável por armazenar as informações inseridas e filtrar os elementos desejados.

* A aplicação busca ser flexível, para assim atender as necessidades específicas dos diversos tipos de edifícios e obras, incluindo a personalização de campos e dados, listas de verificação e incorporação de categorias particulares.

* Além disso, o acesso ao banco de dados não está limitado à apenas ao usuário que realizou a inspeção, mas a qualquer outro autorizado, permitindo consultar as informações registradas a qualquer momento e, portanto, favorecendo o fluxo de trabalho.

* Assim, a aplicação contempla, de forma integrada e centralizada, todo o processo de coleta, registro e exportação de dados das inspeções prediais realizadas.



## 📝 Link de demonstração

_Coloque aqui o link para seu projeto publicado e link para vídeo de demonstração_

## 📁 Estrutura de pastas

Dentre os arquivos e pastas presentes na raiz do projeto, definem-se:

- <b>assets</b>: aqui estão os arquivos relacionados a elementos não-estruturados deste repositório, como imagens.

- <b>document</b>: aqui estão todos os documentos do projeto, como o Web Application  Document (WAD) bem como documentos complementares, na pasta "other".

- <b>src</b>: Todo o código fonte criado para o desenvolvimento do projeto de aplicação web.

- <b>README.md</b>: arquivo que serve como guia introdutório e explicação geral sobre o projeto e a aplicação (o mesmo arquivo que você está lendo agora).

## 💻 Configuração para desenvolvimento e execução do código

*Acrescentar as informações necessárias sobre pré-requisitos (IDEs, bibliotecas, serviços etc.) e instalação básica do projeto, descrevendo eventuais versões utilizadas. Colocar um passo a passo de como o leitor pode baixar o código e executar a aplicação a partir de sua máquina local.*

*exemplo de instruções*

Aqui encontram-se todas as instruções necessárias para a instalação de todos os programas, bibliotecas e ferramentas imprescindíveis para a configuração do ambiente de desenvolvimento.

1. Baixar e instalar o node.js: [https://nodejs.org/pt-br/](https://nodejs.org/pt-br/) (versão 16.15.1 LTS)
2. Clone o repositório em questão.
3. No terminal aberto na raiz do repositório, digite o segundo comando:

```sh
npm install
```

Isso instalará todas as dependências definidas no arquivo <b>package.json</b> que são necessárias para rodar o projeto. Agora o projeto já está pronto para ser modificado. 

4. Renomear o arquivo .env.example para .env, e inserir as informações do banco a serem utilizadas.
5. Para criar o banco de dados com base no modelo físico, digite o seguinte comando:


```sh
npm run migrate
```
6. Já para inserir os dados de teste nas tabelas, incluindo os usuários de teste, utilize o comando:

```sh
npm run migrate:dev
```
NOTA: Os usuários de teste padrão é:

```
email: inspetor@ipt.br
senha: 123
```

```
email: administrador@ipt.br
senha: 123
```

O administrador pode criar as inspeções e atribuí-las ao inspetor, que realiza a criação dos ambientes e registros.

7. Por, fim para rodar o servidor em sua máquina local, digite no terminal:

```sh
npm run start
```




## 🗃 Histórico de lançamentos

* 0.5.0 - XX/XX/2024
    * 
* 0.4.0 - XX/XX/2024
    * 
* 0.3.0 - XX/XX/2024
    * 
* 0.2.0 - XX/XX/2024
    * 
* 0.1.0 - XX/XX/2024
    *

## 📋 Licença/License

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/">This work by </a><a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/Intelihub">Inteli</a>, <a href="https://github.com/AiraaMel">Aira Mel</a>, <a href="https://github.com/caiomota01">Caio Mota</a>, <a href="https://github.com/jlimaz">José Lima</a>, <a href="https://github.com/LucasLopes964">Lucas Lopes</a>, <a href="https://github.com/sarafarencena">Sara Sbardelotto</a>, <a href="https://github.com/TeodoroNeira">Teodoro Neira</a> and <a href="https://github.com/yudiomaki1">Yudi Omaki </a> </a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International</a>.</p>

