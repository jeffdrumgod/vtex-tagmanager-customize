# Tagmanager Customize for Vtex CMS Stores

Customizações para Tag Manager em lojas Vtex CMS

Aplicação de dataLayer para Enhanced Ecommerce com suporte para Google Analytics versão UA e GA4.

## Customizações

O projeto foi criado para tentar manter um modelo padrão de trackings para qualquer loja Vtex utilizando modelo CMS.

Para tal, indicamos que customizações sejam feitas somente nos arquivos principais de trackings (`head-checkout.ts` e `head-bottom.ts`) e nos arquivos que estão na pasta `src/js/custom`.


# Setup

## 🧩 window.customDataLayerConfig

Essa é a variável (Object) que contém variáveis de configuração para a loja. Ela é obrigatória e deve estar declarado antes da chamadas dos scripts de customização.

Os possíveis atributos para esse objeto são:

| Nome         | Descritivo                                                                                                                                                                                                                                  | Valor default / exemplo  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| useGtmJsCustomizable | Nome da variável utilizada para indicar que deve ser realizado o carregamento dos scripts do GTM de forma customizada, não utilizado o que é preenchido no padrão da plataforma.                                                    | `false`                  |
| variableName | Nome da variável usada para o GTM utilizar na armazenagem do dataLayer. O padrão é `dataLayer`, mas pode ser alterado para poder eliminar estrutura que pode ser considerado como lixo ou incorreto, os quais são populados pela plataforma | `dataLayer`              |
| containerId  | identificador do container quando for necessário eliminar a utilização do container padrão da plataforma                                                                                                                                    | `GTM-XXXXXXXX`           |


### Quando devemos utilizar o useGtmJsCustomizable como `true`?

Quando se faz necessário modificações mais severas nos disparos dos dados ao dataLayer, como por exemplo inibir a execução do evento `gtm.js` até termos todos os dados customizados carrefados, se faz necessário mudar este valor para `true` e nas configurações da loja, alterar o código de GTM, deixando no lugar de configuração padrão da plataforma, um valor apenas como `GTM-NAO-EDITE-ISSO`.

Fazendo isso, os eventos do GTM default do CMS serão carregados e disparados, mas não afetarão o dataLayer padrão pois ele estará inválido, e quem se encarregará de carregar o evento padrão é este script do gtm-customize.

Aí sim, neste caso é obrigatório a configuração do valor para o atributo de configuração `containerId`.

## Configuração de templates

### Body Classs

Classes padrões para algumas páginas para detectar qual é o conteúdo da página, já que as variáveis Vtex não são suficientes:

| Class         | tipo de página                                                                      |
| ------------- | ----------------------------------------------------------------------------------- |
| wishlist      | Página de listagem de wishlist (ou se em minha conta, precisa existir o #/wishlist) |
| institutional | Páginas de conteúdo institucional                                                   |
| contact       | Páginas de formulário de contato                                                    |
| error404      | Página de erro 404 e busca vazia                                                    |
| error401      | Página de erro 401                                                                  |
| search        | Página de resultado de busca                                                        |

### Banners

#### Grupo de banners

Ao redor de cada grupo de banner, deve existir uma tag com o atributo `track-banner-group` com o nome do grupo para diferenciá-lo dentro dos trackings. Exemplo:

```html
<section data-track-banner-group="Main Banner">
  <vtex:contentPlaceHolder id="Banner Main" />
</section>
```

Obs: O nome do atributo não necessariamente precisa ser o mesmo nome do placeholder.

#### Atributos para Banners

Quando possível, os seguintes atributos devem ser preenchidos nos banners.

```html
<a
  data-track-banner="item"
  data-track-banner-id="Identificador"
  data-track-banner-name="Nome da campanha"
  data-track-banner-creative="/arquivos/banner_home_desktop.jpg"
  href="/test"
>
  <img src="/arquivos/banner_home_desktop.jpg" />
</a>
```

Eles devem ser populados todos na mesma tag, e de preferência uma única vez e ao redor do link em questão que o referencia. Ou seja, se um bloco de um banner tiver dois links, deve ter duas vezes esse tagueamento. Um para cada link.

É necessário que seja no link pois é ele que recebe o evento. Logo um banner sem click não possui interação, não está dentro do contexto de ativação de click para ser necessário configurações como esta.

### Prateleiras

#### Classe padrão de CSS

Todas as prateleiras, devem ter uma classe padrão para controle de captura dos dados. Essa classe é usada no script default para busca de informações

```
track-shelf
```

#### Atributos dentro do HTML da prateleira

Abaixo um exemplo dos atributos. Esses atributos podem estar em uma nova Tag ao redor de todo conteúdo, ou pode ser aplicado do elemento `root` caso ele já exista ao redor de todo conteúdo.

```html
#if ($product.IsInStock) #set($availableStr = "available") #else #set($availableStr = "unavailable") #end
<div
  data-track-shelf="item"
  data-track-shelf-name="$product.HtmlEscapedName"
  data-track-shelf-pid="$product.Id"
  data-track-shelf-sid="$product.productVariantId"
  data-track-shelf-price="$product.BestPrice"
  data-track-shelf-departament="$product.DepartmentName"
  data-track-shelf-brand="$product.BrandName"
  data-track-shelf-category="$product.CategoryName"
  data-track-shelf-inStock="$availableStr"
>
  <!-- Aqui o restando do conteúdo do item da prateleira -->
</div>
```

##### Complemento dentro do HTML de prateleira

Para melhorar ainda mais o nome da lista, pode ser adicionado um elemento ao redor de onde a prateleira seja inserindo, com o atributo `track-shelf-group-name` com o nome correspondente ao tipo de lista a ser apresentada. Exemplo:

```html
<div data-track-shelf-group-name="Collection Top Sellers">
  <vtex:contentPlaceHolder id="Collection Top Sellers" />
</div>
```

### Extras

#### Página de detalhe de produto

Adicione ao redor do bloco que é apresentado a imagem do produto, nome, botão comprar, preço, etc., na tag que fica ao redor destes itens, o seguintes atributos:

`data-widget-type="product-detail" data-tracking-list="Product Detail"`.

Obs: Tenha em mente que estes itens não podem conter uma prateleira dentro desta tag. Se necessário, ignore a parte de imagem do produto e use a tag que fica ao redor do bloco de botão comprar e input de qualidade.

#### Item em resultado de busca flutuante

Adicione ao redor da lista de itens do resultado de busca fluante o seguinte atributo:

`data-widget-type="search"`

E em cada item da lista, os seguintes atributos:

`data-track-shelf="item" data-tracking-list="widget-search-autocomplete"`

#### Item em carrinho flutuante

Adicione ao redor da lista de itens do carrinho fltuante o seguinte atributo:

`data-widget-type="cart"`

E em cada item da lista, os seguintes atributos:

`data-track-shelf="item" data-tracking-list="widget-cart"`
## Instalação de scripts

### Upload dos arquivos de custmização

Para facilitar a instalação, controle do setup, indicamos que o arquivo seja inserido utilizando os arquivos estáticos do checkout.

Neste caso, a indicação é que seja realizado a criação dos 3 arquivos na pasta de arquivos de checkout, no mesmo local onde é o `checkout6-custom.js`.

Assim a chamada dele dentro do catálogo poderá ser apenas utilizando o path de URL, evidando redirects. Exemplo: `/files/`

### CMS, Catálogo

Para a inserção dos scripts necessários para as customizações, e para ignorar regras Vtex de ordenação de scripts no header, precisamos adicionar alguns novos elementos no cadastro do CMS (CONFIGURAÇÕES DA LOJA > CMS > Layout).

Então, estando no CMS da plataforma, crie um controle customizado (custom elements), com o nome `gtmCustomizeHeadTop`

No conteúdo deste controle customizado, adicione a chamada de script conforme abaixo:

```html
<script>
  // Se for customizado, descomentar o script abaixo
  // window.customDataLayerConfig = {
  //   variableName: 'dataLayer',
  //   containerId: 'GTM-XXXXXX',
  // };
</script>
<script src="https://polyfill.io/v3/polyfill.min.js"></script>
<script src="/files/tagmanager-customize-head-top.min.js?v=date"></script>
```

Adicionalmente, crie outro controle customizado, este outro com o nome `gtmCustomizeHeadBottom`, e nele cadastre o conteúdo html:

```html
<script src="/files/tagmanager-customize-head-bottom.min.js?v=date"></script>
```

Após os constroles customizados criados, identifique os arquivos de templates utilizados na loja e em cada um, adicione como primeira tag do `<head>` a chamada do componente `gtmCustomizeHeadTop` assim como exempolo abaixo

```html
<vtex.cmc:gtmCustomizeHeadTop />
```

E no final da tag `<head>`, como último elemento, o segundo controle customizado, conforme exemplo abaixo:

```html
<vtex.cmc:gtmCustomizeHeadBottom />
```

_OBSERVAÇÃO:_ O controle `gtmCustomizeHeadBottom` só pode ser instalado no final da tag `<head>`. Porém se for necessário capturar alguma informação da página, antes de aguardar o `DOM ready`, é indicado então que ao invés de usar o controle customizado, edite e utilize a tag do arquivo diretamente. Assim a organização de scripts da Vtex vai mover o arquivo para o final da lista de scripts do `head`, e assim ficará depois da criação da variável `vtxctx` e dos scripts base da página.

### Checkout

Para checkout, o processo é um pouco diferente em relação ao catálogo. Para tal precisamos idenficar qual é a versão do checkout para então alterar o script custom específico para a versão que está ativa no site.

Por exemplo, caso seja a versão 6, o arquivo a ser utilizado é o arquivo com nome `checkout6-custom.js`. (Observação: O conteúdo também deve ser inserido no arquivo para página de finalização: `checkout-confirmation-custom.js`)

No topo, antes de todo script do checkout, deve ser inserido o seguinte trecho de código conforme abaixo:

#### Caso o container GTM seja padrão configurado pelo painel Admin

```javascript
/*** START CUSTOM GTM CHECKOUT ***/

(function () {
  var head = document.getElementsByTagName('head')[0];
  var fnLoad = function (id, url) {
    var script = document.createElement('script');
    script.id = id;
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
  };

  fnLoad('polyfill.min.js', 'https://polyfill.io/v3/polyfill.min.js');
  fnLoad('tagmanager-customize-head-top', '/files/tagmanager-customize-head-top.js?v=date');
  fnLoad('tagmanager-customize-head-checkout', '/files/tagmanager-customize-head-checkout.js?v=date');
})();
/*** END CUSTOM GTM CHECKOUT ***/
```
#### Caso o container GTM seja customizado
```javascript
/*** START CUSTOM GTM CHECKOUT ***/
window.vtex = window.vtex || {};
window.vtex.gtmId = false;

window.customDataLayerConfig = {
  variableName: 'dataLayer',
  containerId: 'GTM-XXXXXX',
};

(function () {
  var head = document.getElementsByTagName('head')[0];
  var fnLoad = function (id, url) {
    var script = document.createElement('script');
    script.id = id;
    script.type = 'text/javascript';
    script.src = url;
    head.appendChild(script);
  };

  fnLoad('polyfill.min.js', 'https://polyfill.io/v3/polyfill.min.js');
  fnLoad('tagmanager-customize-head-top', '/files/tagmanager-customize-head-top.js?v=date');
  fnLoad('tagmanager-customize-head-checkout', '/files/tagmanager-customize-head-checkout.js?v=date');
})();
/*** END CUSTOM GTM CHECKOUT ***/
```

### Desativação de script padrão Vtex

Se faz necessário a desativação de scripts padrões da Vtex para Tagmanager para dar suporte as customizações solicitadas por clientes onde alguns dados são necessários já existirem antes dos disparos de eventos padrões do GTM.

Logo, para isso, é necessário realizar uma operação na configuração da loja, para que seja mantido os scripts adicionais da Vtex para imprimir informações na página, mas não disparar a execução do script do GTM.

#### Passo a passo

1. Acessar o admin da loja (https://{store}.myvtex.com/admin).
1. Pelo menu lateral, navegar para o item: "CONFIGURAÇÕES DA LOJA" > "Checkout"
1. Nesta sessão, abrir as configurações da loja padrão, e acessar a aba "Checkout"
1. Na aba Checkout, encontre o campo "Google Tag Manager"
1. Neste campo, mantenha nele o seguinte valor: "GTM-NAOEDITEISSO"

Dessa maneira, o "enganamos" as regras da plataforma, as quais ainda carregarão todos os dados de GTM necessários, porém não irá executar o script do container GTM do cliente.

# Definições, disponibilidades de recursos e exemplos

## Polyfills

Para este projeto é necessário que seja incluído no projeto um script externo responsável por polyfills, o qual facilita e diminui a necessidade de recursos adicionais de polyfills neste projeto.

Para tal, é necessário que antes do carregamento dos scripts do projeto:

`https://polyfill.io/v3/polyfill.min.js`

Com isso navegadores antigos sem novas funcionalidades de script terão acesso aos métodos necessários para utilização dos scripts deste projeto.

Este código já foi inserido se você seguiu o setup acima, indicando a instalação do controle customizado com nome `gtmCustomizeHeadTop`

## 🧩 window.customDataLayer

Este é o object cosntruído a partir da montagem da classe de customização do dataLayer. É utilizado utilizando as configurações existentes em `window.customDataLayerConfig` e com isso constroe o modelo de utilização para o dataLayer dentro das páginas.

Todo e qualquer utilização de envio de informações para o dataLayer, principalmente quando está utilizando o valor de `window.customDataLayerConfig.variableName` diferente de `dataLayar` deve ser passado utilizando o método `window.customDataLayer.push`.

### Métodos para window.customDataLayer

#### 🦾 .push

O tradicional e conhecido método para GTM: `window.dataLayer.push` é neste contexto de setup substituído por `window.customDataLayer.push`.

A forma de utilização é a mesma. Essa mudança se deve pelos logs e possíveis customizações que venham a ser necessárias para a implementação. Por exemplo quebra de lista de produtos em menos itens para envio ao GTM, e utilização ao GA sem quebra na requisição por causa do [tamanho do body da requisição](https://www.simoahava.com/analytics/send-google-analytics-payload-length-as-custom-dimension/).

Exemplo de uso:

```javascript
window.window.customDataLayer.push({ event: 'foo' });
```

### .gtmjs

Este evento `gtm.js`, normalmente é disparado quando o script do GTM foi carregado, logo pelo seu próprio bloco de código.

Porém, pelo fato que, é necessário que ao carregar este evento já exista dados populados no `dataLayer` com informações da página, nós retardamos o disparo do evento `gtm.js`, o qual só é disparado quando chamamos este médodo `window.customDataLayer.gtmjs()`

## PolyFills

Existe para este projeto a necessidade de alguns polyfills. Eles estão sendo descritos no começo deste documento na sessão [Setup](#Setup)


## TODOS

- [ ] Adicionar documentação para que cada evento de finalização de alteração de widget seja executado evento para poder reavaliar conteúdo e gerar os trackings. Exemplo, após completar a apresentação de produtos de widget de search autocomplete