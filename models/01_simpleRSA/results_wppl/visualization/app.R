library(shiny)
library(shinyjs)
library(tidyverse)
library(png)
# library(here)

df = read_csv("data/data_alpha3.csv",col_names = FALSE) %>% 
  rename(condition=X1,
         target=X2,
         colcomp=X3,
         contrast=X4,
         utterance=X5,
         prob=X6)

df_uttcat = df %>% 
  # create utterance categories: target utterance noun, target utterance adj+noun, colcomp utterance noun, colcomp adj+noun, others
  separate(target,c("target_color","target_type")) %>% 
  separate(colcomp,c("colcomp_color","colcomp_type")) %>% 
  mutate(utt_cat = case_when(
    utterance == target_type ~ "target -- noun",
    utterance == target_color ~ "target & comp -- adj",
    utterance == str_c(target_color, target_type, sep=" ") ~ "target -- adj+noun",
    # utterance == colcomp_type ~ "colcomp -- noun",
    # utterance == str_c(colcomp_color, colcomp_type, sep=" ") ~ "colcomp -- adj+noun",
    TRUE ~ "others"
  )) %>%
  group_by(condition,utt_cat) %>%
  summarise(sum_prob=sum(prob)) %>% 
  ungroup() %>% 
  # change order of factor levels in ref_cat
  # mutate_at(vars(utt_cat),
  #           funs(fct_relevel(utt_cat,"target -- noun","target -- adj+noun","target & comp -- adj","colcomp -- noun","colcomp -- adj+noun")))
  mutate_at(vars(utt_cat),
            funs(fct_relevel(utt_cat,"target -- noun","target -- adj+noun","target & comp -- adj")))

# Define UI for app that draws a histogram ----
ui <- fluidPage(
  
  # App title ----
  titlePanel("Condition comparisons!"),
  
  # Sidebar layout with input and output definitions ----
  sidebarLayout(
    
    # Sidebar panel for inputs ----
    sidebarPanel(
      
      # Input: Selector for choosing first condition
      selectInput(inputId = "condition1",
                  label = "Choose the first condition:",
                  choices = c("ttp", "ttn", "tap", "tan", "atp", "atn", "aap", "aan")),
      # context image for first input
      HTML("<div style='height: 80px;'>"),
        imageOutput("myImage1"),
      HTML("</div>"),
      
      HTML("<div style='height: 50px;'>"),
      HTML("</div>"),
      
      # Input: Selector for choosing second condition
      selectInput(inputId = "condition2",
                  label = "Choose the second condition:",
                  choices = c("ttp", "ttn", "tap", "tan", "atp", "atn", "aap", "aan")),
      # context image for second input
      HTML("<div style='height: 80px;'>"),
        imageOutput("myImage2"),
      HTML("</div>")
      
    ),
    
    # Main panel for displaying outputs ----
    mainPanel(
      
      # Output: Plot ----
      plotOutput(outputId = "distPlot"),
      HTML("<div style='height: 50px;'>"),
      HTML("</div>"),
      # Output: Plot ----
      plotOutput(outputId = "distPlot2")
      
    )
  )
)

# Define server logic required to draw a histogram ----
server <- function(input, output) {
  
  # filter data frame according to conditions currently selected
  filtered_df_uttcat = reactive ({
    df_uttcat %>% 
      filter((condition==input$condition1) | (condition==input$condition2))
  })
  
  # filter data frame according to conditions currently selected
  filtered_df = reactive ({
    df %>% 
      filter((condition==input$condition1) | (condition==input$condition2))
  })
  
  # when new compare condition is selected, update image
  condition1_pic = reactive({
    str_c("www/",input$condition1,".png")
  })
  condition2_pic = reactive({
    str_c("www/",input$condition2,".png")
  })
  
  output$myImage1 <- renderImage({
    list(src = condition1_pic(),
         contentType = 'image/png',
         # width = 100,
         height = 70,
         alt = "This is image alternate text")
  },deleteFile = FALSE)
  
  output$myImage2 <- renderImage({
    list(src = condition2_pic(),
         contentType = 'image/png',
         # width = 100,
         height = 70,
         alt = "This is image alternate text")
  },deleteFile = FALSE)
  
  # Geom_col
  # is wrapped in a call to renderPlot to indicate that:
  #
  # 1. It is "reactive" and therefore should be automatically
  #    re-executed when inputs (filtered_df()) change
  # 2. Its output type is a plot
  output$distPlot <- renderPlot({
    
    ggplot(filtered_df_uttcat(), aes(x=utt_cat,y=sum_prob,fill=condition)) +
      geom_col(width=.8, position="dodge") +
      theme_light() +
      theme(axis.text.x = element_text(size = 13),
            axis.title = element_text(size = 16),
            legend.text = element_text(size = 13),
            legend.title = element_text(size = 16)) +
      theme(axis.title.y = element_text(margin = margin(t = 0, r = 20, b = 0, l = 0))) +
      theme(axis.title.x = element_text(margin = margin(t = 20, r = 0, b = 0, l = 0))) +
      scale_fill_manual(values=c("#b0d387", "#4a6d21")) +
      ylim(0,1) +
      theme(legend.position="top") +
      ylab("P(u|o)") +
      xlab("Utterance")
    
  })
  
  output$distPlot2 <- renderPlot({

    ggplot(filtered_df(), aes(x=utterance,y=prob,fill=condition)) +
      geom_col(width=.8, position="dodge") +
      theme_light() +
      theme(axis.text.x = element_text(angle = 30, hjust = 1, size = 13),
            axis.title = element_text(size = 16),
            legend.text = element_text(size = 13),
            legend.title = element_text(size = 16)) +
      theme(axis.title.y = element_text(margin = margin(t = 0, r = 20, b = 0, l = 0))) +
      theme(axis.title.x = element_text(margin = margin(t = 20, r = 0, b = 0, l = 0))) +
      scale_fill_manual(values=c("#d7d7d7", "#7e7e7e")) +
      ylim(0,1) +
      theme(legend.position="top") +
      ylab("P(u|o)") +
      xlab("Utterance")

  })
  
}

# Create Shiny app ----
shinyApp(ui = ui, server = server)