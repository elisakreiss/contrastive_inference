# library(shiny)
# library(shinyjs)
library(tidyverse)
library(Hmisc)
library(bootstrap)
# library(grid)
# library(png)
library(ggimage)
# library(RCurl)

# options("repos" = c("CRAN" = "https://cran.rstudio.com",
#                     "svn.r-project" = "https://svn.r-project.org/R-packages/trunk/foreign"))

source("data/helpers.R")

# library(rsconnect)
# rsconnect::deployApp()

target_color = "#d55e00" # red
comp_color = "#009e74" # blueish green
contrast_color = "#e69d00" # orange
distractor_2_color = "#f0e442" # yellow; always present
distractor_1_color = "#f0e442" # yellow; encoded as contrast

typical_color = "#cc79a7" # purple
atypical_color = "#79a7cc" # blue
mixed_color = "#a7cc79" # green

df_import = read_csv("data/df_full.csv", col_names = TRUE)

df_model_adddata = df_import %>% 
  filter(data_type == "model") %>% 
  mutate(color_typ == "black") %>% 
  mutate(clicked = 0) %>% 
  distinct() %>% 
  mutate_at(vars(obj_in_display_diff), funs(case_when(
    str_detect(condition, "p") & obj_in_display_diff == "target" ~ "contrast",
    str_detect(condition, "p") & obj_in_display_diff == "comp" ~ "distractor",
    (!str_detect(condition, "p")) & obj_in_display_diff == "target" ~ "distractor1",
    (!str_detect(condition, "p")) & obj_in_display_diff == "comp" ~ "distractor2",
    TRUE ~ "FIRE"
  )))

df = df_import %>% 
  bind_rows(df_model_adddata) %>%
  mutate_at(vars(obj_in_display_diff),
            funs(factor(., levels=c("target", "comp", "contrast",
                                    "distractor1", "distractor", "distractor2")))) 

# Define UI for app that draws a histogram ----
ui <- fluidPage(
  
  # App title ----
  titlePanel("Production expectations modulate contrastive inference"),
  
  h4("Elisa Kreiss & Judith Degen, 2020"),
  br(),
  
  # Sidebar layout with input and output definitions ----
  sidebarLayout(
    
    # Sidebar panel for inputs ----
    sidebarPanel(
      
      # Input: data1
      selectInput(inputId = "condition1",
                  label = "Data 1 (in dark colors):",
                  choices = c("Empirical: No prior", "Empirical: Typical prior", "Empirical: Atypical prior", "Model: No prior", "Model: Typical prior", "Model: Atypical prior", "Empirical: No prior (pre-adj)", "Empirical: Typical prior (pre-adj)", "Empirical: Atypical prior (pre-adj)")),
      # context image for first input
      # HTML("<div style='height: 80px;'>"),
      #   imageOutput("myImage1"),
      # HTML("</div>"),
      # 
      # HTML("<div style='height: 20px;'>"),
      # HTML("</div>"),
      
      # Input: data2
      selectInput(inputId = "condition2",
                  label = "Data 2 (in light colors):",
                  choices = c("--", "Empirical: No prior", "Empirical: Typical prior", "Empirical: Atypical prior", "Model: No prior", "Model: Typical prior", "Model: Atypical prior", "Empirical: No prior (pre-adj)", "Empirical: Typical prior (pre-adj)", "Empirical: Atypical prior (pre-adj)")),
      # context image for second input
      # HTML("<div style='height: 80px;'>"),
      #   imageOutput("myImage2"),
      # HTML("</div>")
      
      HTML("<h5>Correlation of target selections between Data 1 and Data 2</h5>"),
      plotOutput(outputId = "corrPlot", height="200px", width="100%"),
      HTML("<p>Correlation Pearson's r is computed from condition means, without variance.<br>Color coding: condition.</p>"),
      
      # Input:
      checkboxInput("context_img",
                    label = "Hide context images"),
      
      # Input: Coloring
      selectInput(inputId = "colorselection",
                  label = "Color coding:",
                  choices = c("Item", "Typicality (typical: purple; atypical: blue)", "Condition")),
      
      # Input: Selections
      selectInput(inputId = "itemselection",
                  label = "Item selections:",
                  choices = c("All", "Target selections only")),
      
      # Conditions
      checkboxGroupInput("condition_selec", 
                         h5("Conditions"), 
                         choices = list("contrast, atyp targ, typ comp" = "atp", 
                                        "contrast, typ targ, typ comp" = "ttp", 
                                        "contrast, atyp targ, atyp comp" = "aap",
                                        "contrast, typ targ, atyp comp" = "tap",
                                        "no contrast, atyp targ, typ comp" = "atn",
                                        "no contrast, typ targ, typ comp" = "ttn",
                                        "no contrast, atyp targ, atyp comp" = "aan",
                                        "no contrast, typ targ, atyp comp" = "tan"),
                         selected = c("atp","ttp","aap","tap","atn","ttn","aan","tan")),
      
    width=3),
    
    # Main panel for displaying outputs ----
    mainPanel(
      
      # Output: Plot ----
      plotOutput(outputId = "distPlot", height="auto")
      # HTML("<div style='height: 100px;'>"),
      # HTML("</div>"),
      # # Output: Plot ----
      # plotOutput(outputId = "corrPlot")
      
    )
  )
)

# Define server logic required to draw a histogram ----
server <- function(input, output, session) {
  
  # observeEvent(input$condition_selec, {
  #   print(paste0("You have chosen: ", input$condition_selec))
  # })
  
  filtered_df = reactive ({
    df %>% 
      filter(sel == input$condition1 | sel == input$condition2) %>% 
      mutate(selection = ifelse(sel == input$condition1, "sel1", "sel2")) %>% 
      # condition filter
      filter(str_detect(condition,str_c(input$condition_selec,collapse="|"))) %>% 
      # mutate_at(vars(condition), funs(factor(.,
      #                                        levels=c("atp", "ttp", "aap", "tap",
      #                                                 "atn", "ttn", "aan", "tan")))) %>% 
      mutate_at(vars(condition), funs(case_when(
        .=="atp" ~ "contrast present\natypical target\ntypical competitor",
        .=="tap" ~ "contrast present\ntypical target\natypical competitor",
        .=="aap" ~ "contrast present\natypical target\natypical competitor",
        .=="ttp" ~ "contrast present\ntypical target\ntypical competitor",
        .=="atn" ~ "contrast absent\natypical target\ntypical competitor",
        .=="tan" ~ "contrast absent\ntypical target\natypical competitor",
        .=="aan" ~ "contrast absent\natypical target\natypical competitor",
        .=="ttn" ~ "contrast absent\ntypical target\ntypical competitor",
        TRUE ~ "FIRE!"
      ))) %>%
      mutate_at(vars(condition), funs(factor(., 
                levels=c("contrast present\natypical target\ntypical competitor",
                         "contrast present\ntypical target\ntypical competitor",
                         "contrast present\natypical target\natypical competitor",
                         "contrast present\ntypical target\natypical competitor",
                         "contrast absent\natypical target\ntypical competitor",
                         "contrast absent\ntypical target\ntypical competitor",
                         "contrast absent\natypical target\natypical competitor",
                         "contrast absent\ntypical target\natypical competitor")))) %>% 
      rename(color_group = case_when(
        input$colorselection == "Item" ~ "color_item", 
        input$colorselection == "Condition" ~ "color_condition", 
        TRUE ~ "color_typ"
      ))
  })
  
  anno = reactive({
    data.frame(condition = c("atp","ttp","aap","tap","atn","ttn","aan","tan"),
               image = c("data/atp.png", "data/ttp.png", "data/aap.png", "data/tap.png",
                         "data/atn.png", "data/ttn.png", "data/aan.png", "data/tan.png")) %>%
          mutate(obj_in_display_diff = 3.5) %>% 
          mutate(clicked = 0.8) %>% 
          mutate(color_group = "something") %>% 
          mutate(selection = "3") %>% 
          filter(str_detect(condition,str_c(input$condition_selec,collapse="|"))) %>% 
          mutate_at(vars(condition), funs(case_when(
            .=="atp" ~ "contrast present\natypical target\ntypical competitor",
            .=="tap" ~ "contrast present\ntypical target\natypical competitor",
            .=="aap" ~ "contrast present\natypical target\natypical competitor",
            .=="ttp" ~ "contrast present\ntypical target\ntypical competitor",
            .=="atn" ~ "contrast absent\natypical target\ntypical competitor",
            .=="tan" ~ "contrast absent\ntypical target\natypical competitor",
            .=="aan" ~ "contrast absent\natypical target\natypical competitor",
            .=="ttn" ~ "contrast absent\ntypical target\ntypical competitor",
            TRUE ~ "FIRE!"
          ))) %>%
      mutate_at(vars(condition), funs(factor(., 
               levels=c("contrast present\natypical target\ntypical competitor",
                        "contrast present\ntypical target\ntypical competitor",
                        "contrast present\natypical target\natypical competitor",
                        "contrast present\ntypical target\natypical competitor",
                        "contrast absent\natypical target\ntypical competitor",
                        "contrast absent\ntypical target\ntypical competitor",
                        "contrast absent\natypical target\natypical competitor",
                        "contrast absent\ntypical target\natypical competitor"))))
    })
  
  all_item_plot =  reactive({
    ggplot(filtered_df(), aes(x=obj_in_display_diff, 
                            y=clicked, 
                            alpha=selection, 
                            fill=color_group)) +
    facet_wrap(~condition, scales = "free_x", ncol=4) +
    stat_summary(fun = "mean",
                 geom = "bar",
                 width = 0.8,
                 position = position_dodge(width = 0.8)) +
    stat_summary(fun.data = "mean_cl_normal",
                 geom = "errorbar",
                 color = "black",
                 position = position_dodge(width = 0.8),
                 size = .5,
                 width = 0.2) +
    theme(legend.position = "none") +
    theme(strip.background = element_rect(color="black", 
                                          fill="white", 
                                          size=1.5,
                                          linetype="solid"),
          strip.text.x = element_text(margin = margin(3,0,3,0, "pt"))
    ) +
    scale_alpha_manual(values=c(1, 1, 0.5)) +
    scale_fill_identity() +
    scale_x_discrete(labels=c("comp"="competitor")) +
    theme(axis.text.x = element_text(angle = 30, hjust = 1)) +
    ylim(0,1) +
    xlab("Item") +
    ylab("Proportion of\n(predicted) selections") +
    theme(text = element_text(size=20)) +
    geom_image(data=anno(), aes(image=image, size = 0.4, by="width", asp = 1)) +
    scale_size_identity()
  })
  
  all_item_plot_noimg =  reactive({
    ggplot(filtered_df(), aes(x=obj_in_display_diff, 
                              y=clicked, 
                              alpha=selection, 
                              fill=color_group)) +
      facet_wrap(~condition, scales = "free_x", ncol=4) +
      stat_summary(fun = "mean",
                   geom = "bar",
                   width = 0.8,
                   position = position_dodge(width = 0.8)) +
      stat_summary(fun.data = "mean_cl_normal",
                   geom = "errorbar",
                   color = "black",
                   position = position_dodge(width = 0.8),
                   size = .5,
                   width = 0.2) +
      theme(legend.position = "none") +
      theme(strip.background = element_rect(color="black", 
                                            fill="white", 
                                            size=1.5,
                                            linetype="solid"),
            strip.text.x = element_text(margin = margin(3,0,3,0, "pt"))
      ) +
      scale_alpha_manual(values=c(1, 0.5)) +
      scale_fill_identity() +
      scale_x_discrete(labels=c("comp"="competitor")) +
      theme(axis.text.x = element_text(angle = 30, hjust = 1)) +
      ylim(0,1) +
      xlab("Item") +
      ylab("Proportion of\n(predicted) selections") +
      theme(text = element_text(size=20))
  })
  
  target_item_plot = reactive({
    filtered_df() %>% 
    filter(obj_in_display_diff == "target") %>% 
    ggplot(., aes(x=condition, 
                  y=clicked, 
                  fill=color_group, 
                  alpha=selection)) +
    stat_summary(fun = "mean", 
                 geom = "bar",
                 width = 0.8,
                 position = position_dodge(width = 0.8)) +
    stat_summary(fun.data = "mean_cl_boot",
                 geom = "errorbar",
                 color = "black",
                 position = position_dodge(width = 0.8),
                 size = .3,
                 width = 0.3) +
    theme(legend.position = "none") +
    theme(strip.background = element_rect(color="black", 
                                          fill="white", 
                                          size=1.5,
                                          linetype="solid"),
          strip.text.x = element_text(margin = margin(3,0,3,0, "pt"))
    ) +
    scale_alpha_manual(values=c(1, 0.5)) +
    scale_fill_identity() +
    theme(axis.text.x = element_text(angle = 45, hjust = 1, vjust=1)) +
    geom_hline(yintercept=1/2, linetype="dashed", color="grey", size=1.5) +
    xlab("Condition") +
    ylab("Proportion of\ntarget selections") +
    ylim(0,1) +
    theme(text = element_text(size=20))
  })
  
  size_h = reactive({
    if(input$itemselection=="All" & length(input$condition_selec) > 4){
      0.7
    } else if (input$itemselection=="All" & length(input$condition_selec) <= 4) {
      0.4
    } else {
      0.7
    }
  })
  
  output$distPlot <- renderPlot({
    if(input$itemselection=="All" & !input$context_img){
      all_item_plot()
    } else if (input$itemselection=="All" & input$context_img) {
      all_item_plot_noimg()
    } else {
      target_item_plot()
    }
  }, height = function() {
    size_h() * session$clientData$output_distPlot_width
  })
  
  
  full_df =  reactive({
      if (!("sel2" %in% unique(filtered_df()$selection))) {
        filtered_df() %>% 
          mutate(selection="sel2") %>% 
          bind_rows(filtered_df())
      } else {
        filtered_df()
      }
    })
  
  corr_df = reactive({
    full_df() %>% 
      # correlation of target selections
      filter(obj_in_display_diff == "target") %>% 
      select(clicked, selection, condition, color_condition_corr) %>% 
      group_by(condition, color_condition_corr, selection) %>% 
      summarise(meanPropClicks=mean(clicked),
                prop_CI_low_diff=ci.low(clicked),
                prop_CI_high_diff=ci.high(clicked)) %>%
      ungroup() %>% 
      mutate(prop_CI_low = meanPropClicks-prop_CI_low_diff) %>% 
      mutate(prop_CI_high = meanPropClicks+prop_CI_high_diff) %>%
      mutate(stats = str_c(meanPropClicks, prop_CI_low, prop_CI_high, sep = "xxx")) %>% 
      select(selection, condition, color_condition_corr, stats) %>% 
      spread(selection, stats) %>% 
      separate(sel1, c("mean1","low1","high1"), sep="xxx") %>% 
      separate(sel2, c("mean2","low2","high2"), sep="xxx") %>% 
      mutate_at(vars(mean1,low1,high1,mean2,low2,high2), funs(as.numeric(.))) %>% 
      mutate_at(vars(condition), funs(str_c(.,"\n")))
    })
  
  output$corrPlot <- renderPlot({
    # print(corr_df())
    corr_df() %>% 
    ggplot(., aes(x=mean1, y=mean2, color=color_condition_corr)) +
      # ggtitle("Correlation of target selections") +
      theme_bw() +
      geom_abline(intercept = 0, slope = 1) +
      geom_errorbar(aes(ymin = low2, ymax = high2), size=.8) + 
      geom_errorbarh(aes(xmin = low1, xmax = high1), size=.8) +
      geom_point(size = 4) +
      xlab("Data 1") +
      ylab("Data 2") +
      xlim(0,1) +
      ylim(0,1) +
      scale_colour_identity() +
      annotate("text", x = 0.3, y = 0.9, label = str_c("r = ", round(
        cor(corr_df()$mean1,corr_df()$mean2, use="complete.obs"), 
        digits = 4)), size=6) +
      theme(legend.position = "none") +
      # theme(axis.title = element_blank()) +
      theme(axis.title = element_text(size=13)) +
      theme(axis.text = element_text(size=11)) +
      theme(panel.background = element_rect(fill = "transparent",colour = NA),
            plot.background = element_rect(fill = "transparent",colour = NA)) +
      theme(aspect.ratio = .8)
  }, bg="transparent")
  
}

# Create Shiny app ----
shinyApp(ui = ui, server = server)